/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RsvpSubmission {
  id: string;
  name: string;
  email: string;
  attendance: 'yes' | 'no' | 'maybe';
  plusOnes: number;
  companionNames?: string;
  dietaryRestrictions?: string;
  favoriteDrink?: string;
  message: string;
  attachmentUrls?: string[];
  attachmentNames?: string[];
  driveFileIds?: string[];
  createdAt: string;
  syncedToGoogle?: boolean;
}

export interface CatProfile {
  id: string;
  name: string;
  title: string;
  personality: string;
  favoriteSpot: string;
  appearanceLikelihood: string;
  medSchoolDiagnosis: string;
  avatarColor: string;
  badge: string;
  quote: string;
}

export interface GoogleSyncConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  driveFolderId: string;
  driveFolderUrl: string;
  lastSyncedAt?: string;
}
