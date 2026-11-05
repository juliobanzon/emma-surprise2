/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleSyncConfig, RsvpSubmission } from '../types';

const STORAGE_KEY_CONFIG = 'emma_party_google_sync_config_v1';
const FOLDER_NAME = "Emma's Surprise Party 2026 - Guest Uploads";
const SPREADSHEET_TITLE = "Emma's Surprise Party (Nov 21, 2026) - RSVPs & Messages";

export const getStoredSyncConfig = (): GoogleSyncConfig | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveStoredSyncConfig = (config: GoogleSyncConfig) => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

/**
 * Searches for or creates a dedicated Google Drive folder for uploads
 */
export async function getOrCreateDriveFolder(accessToken: string): Promise<{ id: string; url: string }> {
  // Search for existing folder created by this app
  const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${FOLDER_NAME}' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      const folder = data.files[0];
      return {
        id: folder.id,
        url: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
      };
    }
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Uploaded guest photos, video greetings, and memories for Emma\'s surprise party on Nov 21, 2026.',
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Drive folder: ${errText}`);
  }

  const folder = await createRes.json();
  const folderUrl = `https://drive.google.com/drive/folders/${folder.id}`;

  // Make folder viewable with link so Emma and Julio can view uploaded memories easily
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${folder.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch (err) {
    console.warn('Could not set public view permission on folder:', err);
  }

  return { id: folder.id, url: folderUrl };
}

/**
 * Uploads a file (photo, video, voice recording, doc) into the Google Drive folder
 */
export async function uploadFileToDrive(
  file: File,
  folderId: string,
  accessToken: string
): Promise<{ id: string; name: string; url: string }> {
  const metadata = {
    name: `[Emma Surprise RSVP] ${file.name}`,
    parents: [folderId],
    description: `Attachment submitted for Emma's Surprise Party RSVP by guest`,
  };

  const boundary = 'foo_bar_baz_emma_surprise_' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const fileData = await fileDataPromise;

  const metadataPart = delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata);

  const mediaPartHeader = delimiter +
    `Content-Type: ${file.type || 'application/octet-stream'}\r\n` +
    'Content-Transfer-Encoding: binary\r\n\r\n';

  // Build multipart payload
  const enc = new TextEncoder();
  const part1 = enc.encode(metadataPart);
  const part2 = enc.encode(mediaPartHeader);
  const part3 = new Uint8Array(fileData);
  const part4 = enc.encode(closeDelimiter);

  const totalLength = part1.byteLength + part2.byteLength + part3.byteLength + part4.byteLength;
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  combined.set(part1, offset);
  offset += part1.byteLength;
  combined.set(part2, offset);
  offset += part2.byteLength;
  combined.set(part3, offset);
  offset += part3.byteLength;
  combined.set(part4, offset);

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: combined,
  });

  if (!uploadRes.ok) {
    const errorBody = await uploadRes.text();
    throw new Error(`Failed to upload ${file.name} to Google Drive: ${errorBody}`);
  }

  const uploaded = await uploadRes.json();
  const fileUrl = uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}/view?usp=sharing`;

  // Grant read permission so host and Emma can open the link
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${uploaded.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });
  } catch (err) {
    console.warn('Could not set permission for file:', err);
  }

  return {
    id: uploaded.id,
    name: file.name,
    url: fileUrl,
  };
}

/**
 * Searches for or creates the Google Sheet for RSVPs & Messages
 */
export async function getOrCreateSpreadsheet(accessToken: string): Promise<{ id: string; url: string }> {
  // Search if spreadsheet already exists in Drive
  const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.spreadsheet' and name = '${SPREADSHEET_TITLE}' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      const sheet = data.files[0];
      return {
        id: sheet.id,
        url: sheet.webViewLink || `https://docs.google.com/spreadsheets/d/${sheet.id}/edit`,
      };
    }
  }

  // Create new spreadsheet via Sheets API
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: 'RSVPs & Messages',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'Name' } },
                    { userEnteredValue: { stringValue: 'Email' } },
                    { userEnteredValue: { stringValue: 'Attendance' } },
                    { userEnteredValue: { stringValue: 'Plus Ones' } },
                    { userEnteredValue: { stringValue: 'Companions' } },
                    { userEnteredValue: { stringValue: 'Dietary Restrictions' } },
                    { userEnteredValue: { stringValue: 'Drink Choice' } },
                    { userEnteredValue: { stringValue: 'Message' } },
                    { userEnteredValue: { stringValue: 'Submission Date' } },
                    { userEnteredValue: { stringValue: 'Media Links' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Sheet: ${errorText}`);
  }

  const sheetData = await createRes.json();
  const sheetId = sheetData.spreadsheetId;
  const sheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  return { id: sheetId, url: sheetUrl };
}

/**
 * Appends an RSVP submission row into the Google Sheet
 */
export async function appendRsvpToGoogleSheet(
  spreadsheetId: string,
  submission: RsvpSubmission,
  accessToken: string
) {
  const attendingLabel =
    submission.attendance === 'yes'
      ? 'YES (Arriving 5PM sharp!)'
      : submission.attendance === 'no'
      ? 'NO (Sending love from afar)'
      : 'MAYBE';

  const driveLinksText = submission.attachmentUrls && submission.attachmentUrls.length > 0
    ? submission.attachmentUrls.join('\n')
    : 'None';

  const values = [
    [
      submission.name,
      submission.email || '',
      attendingLabel,
      submission.plusOnes,
      submission.companionNames || 'None',
      submission.dietaryRestrictions || 'None',
      submission.favoriteDrink || 'None',
      submission.message,
      new Date(submission.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Manila' }) + ' (PHT)',
      driveLinksText,
    ],
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/RSVPs%20&%20Messages!A:J:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  // If tab name failed, fallback to appending to first available range A:J
  if (!appendRes.ok) {
    const retryRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:J:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      }
    );

    if (!retryRes.ok) {
      const err = await retryRes.text();
      throw new Error(`Failed to append row to Google Sheet: ${err}`);
    }
    return await retryRes.json();
  }

  return await appendRes.json();
}

/**
 * Sends an RSVP submission directly to a Google Apps Script Webhook URL.
 * Works seamlessly on Cloudflare Pages without requiring guests to sign in.
 * Uses text/plain with mode: 'no-cors' so that Google's 302 redirect response
 * does not trigger a CORS preflight rejection in modern browsers.
 */
export async function sendRsvpToWebhook(webhookUrl: string, submission: RsvpSubmission): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.trim()) return false;

  const attendingLabel =
    submission.attendance === 'yes'
      ? 'YES (Arriving 5PM sharp!)'
      : submission.attendance === 'no'
      ? 'NO (Sending love from afar)'
      : 'MAYBE';

  const payload = {
    name: submission.name,
    email: submission.email || '',
    attendance: attendingLabel,
    plusOnes: submission.plusOnes,
    companions: submission.companionNames || 'None',
    companionNames: submission.companionNames || 'None',
    dietaryRestrictions: submission.dietaryRestrictions || 'None',
    drinkChoice: submission.favoriteDrink || 'None',
    favoriteDrink: submission.favoriteDrink || 'None',
    message: submission.message,
    timestamp: new Date(submission.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Manila' }) + ' (PHT)',
    attachments: (submission.attachmentNames || []).join(', ') || 'None',
    driveLinks: (submission.attachmentUrls || []).join('\n') || 'None',
  };

  const endpointsToTry: string[] = [webhookUrl.trim()];
  if (webhookUrl.includes('/dev')) {
    endpointsToTry.push(webhookUrl.trim().replace(/\/dev(\?.*)?$/, '/exec$1'));
  } else if (webhookUrl.includes('/exec')) {
    endpointsToTry.push(webhookUrl.trim().replace(/\/exec(\?.*)?$/, '/dev$1'));
  }

  let anySuccess = false;
  for (const endpoint of endpointsToTry) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      anySuccess = true;
    } catch (err) {
      console.warn('Webhook sync error for:', endpoint, err);
    }
  }

  return anySuccess;
}

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers matching designated columns if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Name",
        "Email",
        "Attendance",
        "Plus Ones",
        "Companions",
        "Dietary Restrictions",
        "Drink Choice",
        "Message",
        "Submission Date",
        "Media Links"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.name || "",
      data.email || "",
      data.attendance || "",
      data.plusOnes !== undefined ? data.plusOnes : 0,
      data.companions || data.companionNames || "None",
      data.dietaryRestrictions || "None",
      data.drinkChoice || data.favoriteDrink || "None",
      data.message || "",
      data.timestamp || new Date().toLocaleString(),
      data.driveLinks || data.attachments || "None"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

