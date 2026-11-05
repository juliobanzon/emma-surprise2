/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Table,
  FolderOpen,
  Download,
  RefreshCw,
  ExternalLink,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  Copy,
  Check,
  Code,
  Send,
  HelpCircle,
} from 'lucide-react';
import { RsvpSubmission, GoogleSyncConfig } from '../types';
import {
  getStoredSyncConfig,
  saveStoredSyncConfig,
  getOrCreateSpreadsheet,
  getOrCreateDriveFolder,
  appendRsvpToGoogleSheet,
  sendRsvpToWebhook,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
} from '../lib/googleWorkspace';
import { soundEffects } from '../lib/audioEffects';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: RsvpSubmission[];
  accessToken: string | null;
  onLogin: () => void;
  telegramUrl: string;
  onUpdateTelegramUrl: (url: string) => void;
  sheetWebhookUrl?: string;
  onUpdateSheetWebhookUrl?: (url: string) => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  submissions,
  accessToken,
  onLogin,
  telegramUrl,
  onUpdateTelegramUrl,
  sheetWebhookUrl = '',
  onUpdateSheetWebhookUrl,
}) => {
  const [syncConfig, setSyncConfig] = useState<GoogleSyncConfig | null>(() => getStoredSyncConfig());
  const [isSyncing, setIsSyncing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'maybe'>('all');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [editingTelegramUrl, setEditingTelegramUrl] = useState(telegramUrl);
  const [savedTelegramToast, setSavedTelegramToast] = useState(false);

  // Webhook Sync states for Cloudflare
  const [editingWebhookUrl, setEditingWebhookUrl] = useState(sheetWebhookUrl);

  useEffect(() => {
    if (sheetWebhookUrl) {
      setEditingWebhookUrl(sheetWebhookUrl);
    }
  }, [sheetWebhookUrl]);
  const [savedWebhookToast, setSavedWebhookToast] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedScriptToast, setCopiedScriptToast] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSheetWebhookUrl) {
      onUpdateSheetWebhookUrl(editingWebhookUrl.trim());
    }
    setSavedWebhookToast(true);
    soundEffects.playCoin();
    setTimeout(() => setSavedWebhookToast(false), 2500);
  };

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedScriptToast(true);
    soundEffects.playCoin();
    setTimeout(() => setCopiedScriptToast(false), 2500);
  };

  const handleSendTestRow = async () => {
    if (!editingWebhookUrl.trim()) {
      setTestFeedback({ success: false, message: 'Please enter a Webhook URL first.' });
      return;
    }
    setIsSendingTest(true);
    setTestFeedback(null);

    const testSubmission: RsvpSubmission = {
      id: 'test_' + Date.now(),
      name: 'Test Guest (Julio verification)',
      email: 'julio.test@example.com',
      attendance: 'yes',
      plusOnes: 1,
      companionNames: 'Bunso the cat',
      dietaryRestrictions: 'None (test)',
      favoriteDrink: 'Sparkling Water',
      message: 'Testing Google Sheet sync connection from Cloudflare!',
      createdAt: new Date().toISOString(),
      attachmentNames: ['test_verification.png'],
      attachmentUrls: [],
    };

    const success = await sendRsvpToWebhook(editingWebhookUrl, testSubmission);
    setIsSendingTest(false);

    if (success) {
      setTestFeedback({
        success: true,
        message: '✓ Test row successfully sent to your Google Sheet! Check your spreadsheet now.',
      });
      soundEffects.playFanfare();
    } else {
      setTestFeedback({
        success: false,
        message: 'Could not send test row. Please verify your Apps Script Web App URL and deployment access.',
      });
    }
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTelegramUrl(editingTelegramUrl.trim());
    setSavedTelegramToast(true);
    soundEffects.playCoin();
    setTimeout(() => setSavedTelegramToast(false), 2500);
  };

  if (!isOpen) return null;

  const totalAttending = submissions.filter((s) => s.attendance === 'yes').length;
  const totalPlusOnes = submissions
    .filter((s) => s.attendance === 'yes')
    .reduce((acc, curr) => acc + (curr.plusOnes || 0), 0);
  const totalHeadcount = totalAttending + totalPlusOnes;
  const totalRegrets = submissions.filter((s) => s.attendance === 'no').length;

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'all') return true;
    return s.attendance === filter;
  });

  const handleCreateOrLinkGoogleWorkspace = async () => {
    if (!accessToken) {
      onLogin();
      return;
    }

    try {
      setIsSyncing(true);
      setStatusMsg('Connecting with Google Sheets and Drive...');

      const folder = await getOrCreateDriveFolder(accessToken);
      const sheet = await getOrCreateSpreadsheet(accessToken);

      const newConfig: GoogleSyncConfig = {
        spreadsheetId: sheet.id,
        spreadsheetUrl: sheet.url,
        driveFolderId: folder.id,
        driveFolderUrl: folder.url,
        lastSyncedAt: new Date().toISOString(),
      };

      saveStoredSyncConfig(newConfig);
      setSyncConfig(newConfig);
      setStatusMsg('Successfully connected Google Sheet and Drive folder!');
      soundEffects.playFanfare();
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg('Failed to create/link Google Workspace items. Please check permissions.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAllToGoogle = async () => {
    if (!accessToken) {
      onLogin();
      return;
    }
    if (!syncConfig?.spreadsheetId) {
      await handleCreateOrLinkGoogleWorkspace();
    }

    const currentConfig = getStoredSyncConfig();
    if (!currentConfig?.spreadsheetId) return;

    try {
      setIsSyncing(true);
      setStatusMsg('Syncing all local responses to Google Sheet...');

      for (const sub of submissions) {
        if (!sub.syncedToGoogle) {
          await appendRsvpToGoogleSheet(currentConfig.spreadsheetId, sub, accessToken);
          sub.syncedToGoogle = true;
        }
      }

      // Save updated submissions state
      localStorage.setItem('emma_surprise_rsvps_v1', JSON.stringify(submissions));
      setStatusMsg('All responses synced to your Google Sheet!');
      soundEffects.playFanfare();
    } catch (err) {
      console.error(err);
      setStatusMsg('Some rows could not be synced.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Name',
      'Email',
      'Attendance',
      'Plus Ones',
      'Companions',
      'Dietary Restrictions',
      'Drink Choice',
      'Message',
      'Submission Date',
      'Media Links',
    ];

    const rows = submissions.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${s.attendance === 'yes' ? 'Yes (5PM)' : s.attendance === 'no' ? 'No' : 'Maybe'}"`,
      s.plusOnes,
      `"${(s.companionNames || 'None').replace(/"/g, '""')}"`,
      `"${(s.dietaryRestrictions || 'None').replace(/"/g, '""')}"`,
      `"${(s.favoriteDrink || 'None').replace(/"/g, '""')}"`,
      `"${s.message.replace(/"/g, '""')}"`,
      `"${new Date(s.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Manila' })}"`,
      `"${(s.attachmentUrls || []).join(' ; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Emma_Surprise_Party_RSVPs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundEffects.playCoin();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-linear-to-r from-amber-400 via-pink-400 to-sky-400 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs font-bold text-lg">
              🗂️
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Julio&apos;s Secret Command Deck</h3>
              <p className="text-xs font-semibold text-slate-900">
                Master Guest list &amp; Google Workspace sync hub
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {statusMsg && (
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-300 text-sky-900 text-xs font-medium flex items-center justify-between">
              <span>{statusMsg}</span>
              <button
                type="button"
                onClick={() => setStatusMsg(null)}
                className="text-sky-700 hover:text-sky-950 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
                <span>Attending (5PM)</span>
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalAttending}</div>
              <div className="text-[11px] text-slate-500 font-medium">Headcount: {totalHeadcount}</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
                <span>Regrets</span>
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalRegrets}</div>
              <div className="text-[11px] text-slate-500 font-medium">Left sweet messages</div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <div className="flex items-center justify-between text-sky-800 text-xs font-bold mb-1">
                <span>Plus-Ones</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalPlusOnes}</div>
              <div className="text-[11px] text-slate-500 font-medium">Extra guests</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-1">
                <span>Total Responses</span>
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{submissions.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">In local database</div>
            </div>
          </div>

          {/* Google Sheets Live Sync (Cloudflare & Zero-Auth Guest Ready) */}
          <div className="p-5 rounded-3xl bg-linear-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-700" />
                    <span>Live Google Sheet Sync (Cloudflare Ready)</span>
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Connect your Google Sheet so <strong>every guest RSVP automatically appends a new row</strong> directly into its designated column.
                </p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-0.5 mr-1">Designated Columns:</span>
                  {[
                    'A: Name',
                    'B: Email',
                    'C: Attendance',
                    'D: Plus Ones',
                    'E: Companions',
                    'F: Dietary Restrictions',
                    'G: Drink Choice',
                    'H: Message',
                  ].map((col) => (
                    <span
                      key={col}
                      className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-900 text-[10px] font-semibold font-mono shadow-2xs"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {savedWebhookToast && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-3 py-1 rounded-lg shrink-0">
                  ✓ Saved!
                </span>
              )}
            </div>

            {/* Webhook Input Form */}
            <form onSubmit={handleSaveWebhook} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Google Apps Script Web App URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={editingWebhookUrl}
                  onChange={(e) => setEditingWebhookUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Save Sheet Webhook
                </button>
              </div>
            </form>

            {/* Action buttons: Test Connection & Copy Apps Script */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSendTestRow}
                disabled={isSendingTest}
                className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTest ? 'Sending Test Row...' : 'Send Test Row to Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAppsScript}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                {copiedScriptToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied Apps Script!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Apps Script Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowScriptCode(!showScriptCode)}
                className="text-xs text-emerald-800 hover:underline font-semibold flex items-center gap-1 ml-auto"
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showScriptCode ? 'Hide Instructions' : 'How to set this up in 60s'}</span>
              </button>
            </div>

            {/* Test Feedback Notice */}
            {testFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testFeedback.success
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {testFeedback.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testFeedback.message}</span>
              </div>
            )}

            {/* Step-by-Step Instructions & Code Snippet */}
            {showScriptCode && (
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-xs space-y-3">
                <div className="font-bold text-slate-900">
                  ⚡ 60-Second Google Sheet Setup (Works 100% on Cloudflare without guest logins):
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li>Open your Google Sheet, then click <strong>Extensions → Apps Script</strong> in the top menu.</li>
                  <li>Erase any template code in the editor, click <strong>&ldquo;Copy Apps Script Code&rdquo;</strong> above, and paste it.</li>
                  <li>Click <strong>Deploy → New deployment</strong>.</li>
                  <li>Select type: <strong>Web app</strong>. Set <em>Execute as: Me</em>, and <em>Who has access: Anyone</em>.</li>
                  <li>Click <strong>Deploy</strong>, authorize if prompted, and copy the <strong>Web app URL</strong>.</li>
                  <li>Paste the URL above and click <strong>Save Sheet Webhook</strong>!</li>
                </ol>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl text-[11px] overflow-x-auto font-mono max-h-48">
                  {GOOGLE_APPS_SCRIPT_TEMPLATE}
                </pre>
              </div>
            )}
          </div>

          {/* Direct Google Workspace & Drive OAuth Hub */}
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Table className="w-4 h-4 text-slate-700" />
                  <span>Google Workspace Direct Links (Host OAuth)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Target spreadsheet and media drive folder for all guestbook entries.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateOrLinkGoogleWorkspace}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {syncConfig ? 'Recheck / Refresh' : 'Create Google Sheet & Drive'}
                </button>

                <button
                  type="button"
                  onClick={handleSyncAllToGoogle}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Sync Local Responses to Sheet
                </button>
              </div>
            </div>

            {syncConfig ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={syncConfig.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white border border-emerald-300 hover:border-emerald-500 text-left flex items-center justify-between group transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Table className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        Emma&apos;s RSVPs Google Sheet
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        ID: {syncConfig.spreadsheetId}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                </a>

                <a
                  href={syncConfig.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white border border-sky-300 hover:border-sky-500 text-left flex items-center justify-between group transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                        Emma&apos;s Uploads Google Drive Folder
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        ID: {syncConfig.driveFolderId}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 ml-2" />
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>Click &ldquo;Create Google Sheet &amp; Drive&rdquo; to auto-provision the file and folder for Emma.</span>
              </div>
            )}
          </div>

          {/* Telegram Group Chat Configuration for Real-time Updates */}
          <div className="p-5 rounded-3xl bg-linear-to-r from-sky-50 via-cyan-50 to-blue-50 border-2 border-sky-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <svg className="w-4 h-4 fill-sky-600 shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  <span>Telegram Stealth Ops Group Link</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Update the group chat invite link whenever you create it. Guests will see the updated button across the website!
                </p>
              </div>
              {savedTelegramToast && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  ✓ Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveTelegram} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="url"
                required
                placeholder="https://t.me/your_telegram_group_link"
                value={editingTelegramUrl}
                onChange={(e) => setEditingTelegramUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-sky-300 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-xs transition-colors shrink-0"
              >
                Save Link
              </button>
            </form>
          </div>

          {/* Guest list filter and CSV export */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter:</span>
                {(['all', 'yes', 'no', 'maybe'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFilter(opt)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                      filter === opt
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt === 'all' ? 'All Responses' : opt === 'yes' ? 'Attending' : opt === 'no' ? 'Regrets' : 'Maybe'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Submissions Table */}
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No submissions matching this filter yet. Send the link to friends!
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Plus-Ones</th>
                      <th className="p-3">Message for Emma</th>
                      <th className="p-3">Attachments</th>
                      <th className="p-3">Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{sub.name}</div>
                          <div className="text-[10px] text-slate-400">{sub.email || 'No email provided'}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              sub.attendance === 'yes'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.attendance === 'no'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.attendance === 'yes' ? 'Attending' : sub.attendance === 'no' ? 'Regrets' : 'Maybe'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">
                          {sub.plusOnes > 0 ? (
                            <span>
                              +{sub.plusOnes} {sub.companionNames ? `(${sub.companionNames})` : ''}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="p-3 max-w-xs text-slate-700 truncate" title={sub.message}>
                          {sub.message || <span className="italic text-slate-400">None</span>}
                        </td>
                        <td className="p-3">
                          {sub.attachmentUrls && sub.attachmentUrls.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {sub.attachmentUrls.map((url, i) => (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 font-bold truncate max-w-[120px]"
                                >
                                  <LinkIcon className="w-3 h-3" />
                                  File {i + 1}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">None</span>
                          )}
                        </td>
                        <td className="p-3">
                          {sub.syncedToGoogle ? (
                            <span className="text-[10px] text-emerald-600 font-bold">✓ Synced</span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold">Local</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Remember: Emma&apos;s surprise is on Nov 21, 2026. Real birthday is Dec 2!</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Close Deck
          </button>
        </div>
      </div>
    </div>
  );
};
