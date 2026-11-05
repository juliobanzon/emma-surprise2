/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Send,
  Upload,
  FileVideo,
  Image as ImageIcon,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  ExternalLink,
  Loader2,
  Table,
} from 'lucide-react';
import { RsvpSubmission } from '../types';
import {
  getStoredSyncConfig,
  saveStoredSyncConfig,
  getOrCreateDriveFolder,
  getOrCreateSpreadsheet,
  uploadFileToDrive,
  appendRsvpToGoogleSheet,
  sendRsvpToWebhook,
} from '../lib/googleWorkspace';
import { TapeStrip } from './CollageElements';

interface RsvpFormProps {
  accessToken: string | null;
  onLogin: () => void;
  onSubmissionSuccess: (sub: RsvpSubmission) => void;
  telegramUrl?: string;
  sheetWebhookUrl?: string;
  onOpenOrganizer?: () => void;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({
  accessToken,
  onLogin,
  onSubmissionSuccess,
  telegramUrl,
  sheetWebhookUrl,
  onOpenOrganizer,
}) => {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [plusOnes, setPlusOnes] = useState(0);
  const [companionNames, setCompanionNames] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [favoriteDrink, setFavoriteDrink] = useState('');
  const [message, setMessage] = useState('');

  // Attachments
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording (Voice note)
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<RsvpSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${name || 'guest'}-${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        setSelectedFiles((prev) => [...prev, audioFile]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert('Could not access microphone. Please grant permission in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!message.trim() && attendance === 'no') {
      setErrorMessage('Since you cannot make it, please leave a brief message for Emma in the Answer Box!');
      return;
    }
    setErrorMessage(null);
    setShowConfirmModal(true);
  };

  const executeSubmission = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setErrorMessage(null);
    setUploadProgress('Preparing submission...');

    const submissionId = 'rsvp_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const createdAt = new Date().toISOString();

    const uploadedDriveUrls: string[] = [];
    const uploadedDriveIds: string[] = [];
    const attachmentNames: string[] = selectedFiles.map((f) => f.name);

    let syncedToGoogle = false;

    try {
      // Step 1: If Google Sheet Webhook URL is configured (works on Cloudflare without user login)
      if (sheetWebhookUrl) {
        setUploadProgress('Sending RSVP to Emma\'s Google Sheet...');
        const webhookPayload: RsvpSubmission = {
          id: submissionId,
          name: name.trim(),
          email: email.trim(),
          attendance,
          plusOnes,
          companionNames: companionNames.trim(),
          dietaryRestrictions: dietaryRestrictions.trim(),
          favoriteDrink: favoriteDrink.trim(),
          message: message.trim(),
          attachmentUrls: uploadedDriveUrls,
          attachmentNames,
          driveFileIds: uploadedDriveIds,
          createdAt,
          syncedToGoogle: true,
        };
        const ok = await sendRsvpToWebhook(sheetWebhookUrl, webhookPayload);
        if (ok) {
          syncedToGoogle = true;
        }
      }

      if (accessToken) {
        // Step 2: Ensure Google Drive folder exists
        setUploadProgress('Connecting to Google Drive...');
        const syncConfig = getStoredSyncConfig();

        let driveFolderId = syncConfig?.driveFolderId;
        let driveFolderUrl = syncConfig?.driveFolderUrl;

        if (!driveFolderId) {
          const folderInfo = await getOrCreateDriveFolder(accessToken);
          driveFolderId = folderInfo.id;
          driveFolderUrl = folderInfo.url;
        }

        // Step 2: Upload files into Google Drive
        if (selectedFiles.length > 0 && driveFolderId) {
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            setUploadProgress(`Uploading ${file.name} to Google Drive (${i + 1}/${selectedFiles.length})...`);
            const driveFile = await uploadFileToDrive(file, driveFolderId, accessToken);
            uploadedDriveUrls.push(driveFile.url);
            uploadedDriveIds.push(driveFile.id);
          }
        }

        // Step 3: Ensure Google Sheet exists
        setUploadProgress('Writing response to Google Sheet...');
        let spreadsheetId = syncConfig?.spreadsheetId;
        let spreadsheetUrl = syncConfig?.spreadsheetUrl;

        if (!spreadsheetId) {
          const sheetInfo = await getOrCreateSpreadsheet(accessToken);
          spreadsheetId = sheetInfo.id;
          spreadsheetUrl = sheetInfo.url;
        }

        saveStoredSyncConfig({
          spreadsheetId: spreadsheetId!,
          spreadsheetUrl: spreadsheetUrl!,
          driveFolderId: driveFolderId!,
          driveFolderUrl: driveFolderUrl!,
          lastSyncedAt: new Date().toISOString(),
        });

        // Step 4: Append RSVP & message row into Google Sheet
        const payload: RsvpSubmission = {
          id: submissionId,
          name: name.trim(),
          email: email.trim(),
          attendance,
          plusOnes,
          companionNames: companionNames.trim(),
          dietaryRestrictions: dietaryRestrictions.trim(),
          favoriteDrink: favoriteDrink.trim(),
          message: message.trim(),
          attachmentUrls: uploadedDriveUrls,
          attachmentNames,
          driveFileIds: uploadedDriveIds,
          createdAt,
          syncedToGoogle: true,
        };

        await appendRsvpToGoogleSheet(spreadsheetId!, payload, accessToken);
        syncedToGoogle = true;
      }
    } catch (err: unknown) {
      console.warn('Google Workspace sync notice:', err);
    }

    const finalRecord: RsvpSubmission = {
      id: submissionId,
      name: name.trim(),
      email: email.trim(),
      attendance,
      plusOnes,
      companionNames: companionNames.trim(),
      dietaryRestrictions: dietaryRestrictions.trim(),
      favoriteDrink: favoriteDrink.trim(),
      message: message.trim(),
      attachmentUrls: uploadedDriveUrls,
      attachmentNames,
      driveFileIds: uploadedDriveIds,
      createdAt,
      syncedToGoogle,
    };

    try {
      const existingRaw = localStorage.getItem('emma_surprise_rsvps_v1');
      const list: RsvpSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
      list.push(finalRecord);
      localStorage.setItem('emma_surprise_rsvps_v1', JSON.stringify(list));
    } catch {
      // ignore
    }

    onSubmissionSuccess(finalRecord);
    setSubmittedData(finalRecord);
    setIsSubmitting(false);
    setUploadProgress('');
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setName('');
    setEmail('');
    setAttendance('yes');
    setPlusOnes(0);
    setCompanionNames('');
    setDietaryRestrictions('');
    setFavoriteDrink('');
    setMessage('');
    setSelectedFiles([]);
  };

  return (
    <section id="rsvp" className="py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            RSVP &amp; Message Box
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Please let Julio know if you can make it, and leave a written note or video message for Emma.
          </p>
        </div>

        {submittedData ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Thank you, {submittedData.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {submittedData.attendance === 'yes'
                  ? 'Your RSVP has been saved. See you on Saturday, Nov 21, 2026 at 5:00 PM!'
                  : 'Your response and message have been saved for Emma.'}
              </p>
            </div>

            {/* Telegram Prompt */}
            {telegramUrl && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  Stay updated on party day
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Join the Telegram chat for real-time alerts when Emma is heading home.
                </p>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Telegram Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Submit another response / edit
            </button>
          </div>
        ) : (
          <div className="relative bg-white rounded-3xl p-6 sm:p-9 border-2 border-slate-200/90 shadow-[3px_5px_0px_rgba(0,0,0,0.06)] space-y-6">
            <TapeStrip rotation="-rotate-6" className="absolute -top-2 left-10" />
            <TapeStrip rotation="rotate-6" className="absolute -top-2 right-10" />

            {/* Google Workspace status indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Table className="w-3.5 h-3.5 text-slate-400" />
                {sheetWebhookUrl || accessToken ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Google Sheet sync active</span>
                  </span>
                ) : (
                  <span>Responses sync to Emma&apos;s Sheet</span>
                )}
              </div>
              {!sheetWebhookUrl && !accessToken && onOpenOrganizer && (
                <button
                  type="button"
                  onClick={onOpenOrganizer}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium underline text-left sm:text-right"
                >
                  Connect Sheet (Organizer)
                </button>
              )}
            </div>

            <form onSubmit={handlePreSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="First and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Attendance */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Can You Make It on Nov 21 @ 5:00 PM? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttendance('yes')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      attendance === 'yes'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Yes, coming at 5PM</div>
                    <div className={`text-[10px] ${attendance === 'yes' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Will be there ahead of Emma
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('no')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      attendance === 'no'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Can&apos;t make it</div>
                    <div className={`text-[10px] ${attendance === 'no' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Leaving a message for Emma
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('maybe')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      attendance === 'maybe'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Maybe / Tentative</div>
                    <div className={`text-[10px] ${attendance === 'maybe' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Will coordinate with Julio
                    </div>
                  </button>
                </div>
              </div>

              {/* Plus Ones */}
              {attendance === 'yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <label htmlFor="plusOnes" className="block text-xs font-bold text-slate-700 mb-1">
                      Plus-Ones
                    </label>
                    <select
                      id="plusOnes"
                      value={plusOnes}
                      onChange={(e) => setPlusOnes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value={0}>0 (Just me)</option>
                      <option value={1}>+1</option>
                      <option value={2}>+2</option>
                      <option value={3}>+3</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="companionNames" className="block text-xs font-bold text-slate-700 mb-1">
                      Companion Name(s)
                    </label>
                    <input
                      id="companionNames"
                      type="text"
                      placeholder="e.g. my yaya"
                      value={companionNames}
                      onChange={(e) => setCompanionNames(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Dietary & Drink Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dietary Restrictions
                  </label>
                  <input
                    id="dietaryRestrictions"
                    type="text"
                    placeholder="e.g. Vegetarian, nut allergy"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label htmlFor="favoriteDrink" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Favorite Drink
                  </label>
                  <input
                    id="favoriteDrink"
                    type="text"
                    placeholder="e.g. Iced tea, beer, gin tonic"
                    value={favoriteDrink}
                    onChange={(e) => setFavoriteDrink(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* The Answer Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="answer-box" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message / Video Note for Emma
                    {attendance === 'no' && <span className="text-rose-500"> *</span>}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Synced to Google Sheet</span>
                </div>
                <textarea
                  id="answer-box"
                  rows={4}
                  required={attendance === 'no'}
                  placeholder="Write a message, inside joke, med school encouragement, or video greeting note for Emma..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-slate-900 text-sm leading-relaxed"
                />
              </div>

              {/* Attachments for Google Drive */}
              <div className="p-4 rounded-2xl border border-dashed border-slate-300 space-y-3 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Attach Photos, Video or Voice Memo
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Uploaded directly to Google Drive and linked in the sheet.
                    </p>
                  </div>

                  {/* Voice Memo Button */}
                  <div>
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Recording</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5 text-slate-500" />
                        <span>Record Voice Note</span>
                      </button>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-400 cursor-pointer text-center text-xs text-slate-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Browse files to attach (Photos, MP4, MOV, Audio)</span>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                      Attached Files ({selectedFiles.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-1.5 truncate mr-2">
                            {file.type.startsWith('video') ? (
                              <FileVideo className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate text-slate-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full bg-[#1E3A5F] hover:bg-[#152B47] text-white font-bold text-base sm:text-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#152B47] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{uploadProgress || 'Submitting to Emma\'s Sheet...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send RSVP &amp; Message to Emma&apos;s Sheet</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <h4 className="text-lg font-bold text-slate-900">
                Confirm RSVP
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your response will be recorded into Emma&apos;s Party Google Sheet
                {selectedFiles.length > 0 && ` along with ${selectedFiles.length} file attachment(s)`}.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                <div><strong>Name:</strong> {name}</div>
                <div><strong>Attendance:</strong> {attendance === 'yes' ? 'Yes (5:00 PM)' : attendance === 'no' ? 'No' : 'Maybe'}</div>
                {message && <div><strong>Message:</strong> <span className="italic">{message.slice(0, 60)}{message.length > 60 ? '...' : ''}</span></div>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={executeSubmission}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Confirm &amp; Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
