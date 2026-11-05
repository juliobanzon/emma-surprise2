/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { HeroWelcome } from './components/HeroWelcome';
import { StealthMissionGuide } from './components/StealthMissionGuide';
import { RsvpForm } from './components/RsvpForm';
import { Footer } from './components/Footer';
import { OrganizerModal } from './components/OrganizerModal';
import { TelegramBanner } from './components/TelegramBanner';
import { EVENT_DETAILS } from './data/partyDetails';
import { RsvpSubmission } from './types';
import { initAuth, googleSignIn, logout as authLogout } from './lib/firebaseAuth';

// Initial sample guestbook record
const INITIAL_DEMO_SUBMISSIONS: RsvpSubmission[] = [
  {
    id: 'demo-1',
    name: 'Julio Banzon',
    email: 'julio@example.com',
    attendance: 'yes',
    plusOnes: 0,
    companionNames: '',
    dietaryRestrictions: 'None',
    favoriteDrink: 'Ice cold ginger ale',
    message: 'Can\'t wait for this! Remember to park at Palosapis park everyone!',
    createdAt: '2026-11-01T10:00:00.000Z',
    syncedToGoogle: false,
  },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

  // Submissions list
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('emma_surprise_rsvps_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_DEMO_SUBMISSIONS;
  });

  // Telegram Group Link state
  const [telegramUrl, setTelegramUrl] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('emma_party_telegram_url_v1');
      if (stored && stored !== 'https://t.me/+EmmaSurpriseNov21') return stored;
    } catch {
      // ignore
    }
    return EVENT_DETAILS.defaultTelegramUrl;
  });

  const handleUpdateTelegramUrl = (newUrl: string) => {
    setTelegramUrl(newUrl);
    try {
      localStorage.setItem('emma_party_telegram_url_v1', newUrl);
    } catch {
      // ignore
    }
  };

  // Google Sheet Webhook URL state (for automatic Cloudflare sync)
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('emma_party_sheet_webhook_url_v1');
      if (stored && stored.trim().includes('/exec')) return stored;
    } catch {
      // ignore
    }
    return EVENT_DETAILS.defaultSheetWebhookUrl || '';
  });

  const handleUpdateSheetWebhookUrl = (newUrl: string) => {
    setSheetWebhookUrl(newUrl);
    try {
      localStorage.setItem('emma_party_sheet_webhook_url_v1', newUrl);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err) {
      console.error('Google Sign In error:', err);
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setAccessToken(null);
  };

  const handleSubmissionSuccess = (newSub: RsvpSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] text-[#1E293B] font-sans selection:bg-amber-200 selection:text-slate-900 flex flex-col justify-between">
      {/* Sleek Minimalist Navigation Bar */}
      <Navbar
        onOpenOrganizer={() => setIsOrganizerOpen(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-1 space-y-6">
        {/* Editorial Welcome & Julio's Dispatch */}
        <HeroWelcome />

        {/* Clean Parking & Direction Protocol */}
        <StealthMissionGuide />

        {/* Telegram Updates Callout */}
        <div id="telegram-group" className="max-w-3xl mx-auto px-4 sm:px-6">
          <TelegramBanner
            telegramUrl={telegramUrl}
            onOpenOrganizer={() => setIsOrganizerOpen(true)}
          />
        </div>

        {/* Answer Box, Attachments & Google Sheet Sync */}
        <RsvpForm
          accessToken={accessToken}
          onLogin={handleLogin}
          onSubmissionSuccess={handleSubmissionSuccess}
          telegramUrl={telegramUrl}
          sheetWebhookUrl={sheetWebhookUrl}
          onOpenOrganizer={() => setIsOrganizerOpen(true)}
        />
      </main>

      {/* Minimal Footer */}
      <Footer onOpenOrganizer={() => setIsOrganizerOpen(true)} />

      {/* Julio's Organizer Deck */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
        submissions={submissions}
        accessToken={accessToken}
        onLogin={handleLogin}
        telegramUrl={telegramUrl}
        onUpdateTelegramUrl={handleUpdateTelegramUrl}
        sheetWebhookUrl={sheetWebhookUrl}
        onUpdateSheetWebhookUrl={handleUpdateSheetWebhookUrl}
      />
    </div>
  );
}
