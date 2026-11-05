/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EVENT_DETAILS } from '../data/partyDetails';

interface FooterProps {
  onOpenOrganizer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrganizer }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 py-10 px-4 sm:px-6 text-slate-500 text-xs">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900 text-sm">
              Emma&apos;s Surprise Party • Nov 21, 2026
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              3063 Lauan Extension, UPS 2, Parañaque City • Park at Palosapis St. Park
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenOrganizer}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
          >
            Organizer Deck (Julio)
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-400 text-[11px]">
          <span>Arrival at 5:00 PM Sharp • Keep it a surprise!</span>
          <span>Dress code: house party at Emma&apos;s house (wear whatever you want)</span>
        </div>
      </div>
    </footer>
  );
};
