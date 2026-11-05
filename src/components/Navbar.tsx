/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Settings } from 'lucide-react';
import { ScrapbookNavLetters } from './CollageElements';

interface NavbarProps {
  onOpenOrganizer: () => void;
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrganizer,
  user,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F0F5FA]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Scrapbook Letters Brand */}
        <a href="#welcome" className="flex items-center gap-2 group select-none">
          <ScrapbookNavLetters />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
              &apos;s Surprise Party
            </span>
            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-600 bg-stone-200/70 px-2 py-0.5 rounded-full border border-stone-300/60">
              Nov 21
            </span>
          </div>
        </a>

        {/* Minimal Navigation */}
        <nav className="hidden sm:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
          <a href="#welcome" className="hover:text-slate-900 transition-colors">
            The Note
          </a>
          <a href="#directions" className="hover:text-slate-900 transition-colors">
            Directions &amp; Parking
          </a>
          <a
            href="#rsvp"
            className="px-4 py-1.5 rounded-full bg-[#1E3A5F] text-white text-xs sm:text-sm font-bold hover:bg-[#152B47] transition-colors shadow-2xs border border-[#152B47]"
          >
            RSVP &amp; Message
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google'}
                  className="w-7 h-7 rounded-full border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                  {user.displayName?.[0] || 'G'}
                </div>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="text-[11px] text-slate-400 hover:text-slate-700 underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>Connect Google</span>
            </button>
          )}

          {/* Organizer Gear Icon */}
          <button
            type="button"
            onClick={onOpenOrganizer}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Julio's Organizer Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
