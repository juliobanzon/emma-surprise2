/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { TapeStrip } from './CollageElements';

interface TelegramBannerProps {
  telegramUrl: string;
  onOpenOrganizer?: () => void;
}

export const TelegramBanner: React.FC<TelegramBannerProps> = ({ telegramUrl, onOpenOrganizer }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-[#1E293B] text-white p-6 sm:p-7 shadow-xs border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 overflow-hidden">
      <TapeStrip rotation="-rotate-6" className="absolute -top-2 left-6 opacity-40" />

      <div className="space-y-1 max-w-lg">
        <div className="text-stone-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
          <span>🔔</span>
          <span>Real-time Stealth Coordination</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight">
          Join the Telegram Group Chat!
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Julio will post live updates on November 21 as Emma is on her way so you know when to park, enter quietly, and take your hiding spots.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
        {/* Minimal pill button */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#2D445D] hover:bg-[#385472] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-2xs border border-slate-500/60"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
          <span>Open Telegram Chat</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-white/20"
          title="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        {onOpenOrganizer && (
          <button
            type="button"
            onClick={onOpenOrganizer}
            className="text-[11px] text-sky-300 hover:text-white underline font-medium"
          >
            Edit link
          </button>
        )}
      </div>
    </div>
  );
};
