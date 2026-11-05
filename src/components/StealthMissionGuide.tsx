/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Car,
  Copy,
  Check,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { TapeStrip, CurlyDoodleArrow } from './CollageElements';
import { EVENT_DETAILS } from '../data/partyDetails';

export const StealthMissionGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(EVENT_DETAILS.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Emma's Surprise Party (Secret Ops)");
    const details = encodeURIComponent(
      `Surprise party for Emma! Arrive at 5:00 PM SHARP before Emma gets home (~5:30 PM).\n\nPARKING: Park at the Village Park on Palosapis St. (UPS 2) so Emma won't see cars in front of her house.\n\nAddress: 3063 Lauan Extension, United Paranaque Subdivision 2, East Service Road, Parañaque City.\n\nDress code: "house party at emma's house" (wear whatever you want).\n\nReminder: Her real birthday is Dec 2, do NOT greet her early!`
    );
    const location = encodeURIComponent(EVENT_DETAILS.address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261121T090000Z/20261121T140000Z&details=${details}&location=${location}`;
  };

  return (
    <section id="directions" className="py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Stealth Reconnaissance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Directions &amp; Palosapis Park Parking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Please park at the village park to avoid raising suspicion before 5:00 PM.
          </p>
        </div>

        {/* Parking Protocol Card */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <TapeStrip rotation="-rotate-3" className="absolute -top-2 left-8" />
          <TapeStrip rotation="rotate-3" className="absolute -top-2 right-8" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold uppercase text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 inline-block">
                Mandatory Stealth Directive
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                Park at the Village Park on Palosapis St.
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
              Arrival: 5:00 PM Sharp
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            <p>
              Guests need to park there so it is not suspicious. Please park at the parking spaces at the village park on Palosapis St., United Paranaque Subdivision 2, then you can just walk 100 meters down Lauan Extension to Emma&apos;s house.
            </p>
            <p>
              Emma&apos;s house cannot be pinned directly on Google Maps so the &ldquo;House Pin&rdquo; below directs you to 3365 Lauan St, which is just one house away from Emma&apos;s.
            </p>
            <div className="pt-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-sm sm:text-base font-bold text-slate-800">
                  If you need more help with directions, join the Telegram group chat by clicking the link somewhere down there
                </p>
                <div className="text-xs text-slate-500 italic">
                  (scroll down to find the Telegram group card)
                </div>
              </div>
              <div className="flex items-center gap-2 self-center sm:self-auto shrink-0">
                <CurlyDoodleArrow className="w-7 h-9 opacity-70" />
              </div>
            </div>
          </div>

          {/* Visual Route Map: Palosapis Park to Peckson House */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF9F5] shadow-xs">
            <div className="relative overflow-hidden">
              <picture className="w-full block">
                <source srcSet="/assets/aistudio/Peckson_House_directions_d439c836.webp" type="image/webp" />
                <img
                  src="/assets/aistudio/Peckson_House_directions_d439c836.png"
                  alt="Directions from Palosapis Park to Peckson House"
                  className="w-full h-auto max-h-[520px] object-contain mx-auto block"
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="px-4 py-2 bg-stone-100/90 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <span>🐾</span>
                <span>Follow the pink paw prints from Palosapis Park to the entrance</span>
              </span>
              <a
                href="/assets/aistudio/Peckson_House_directions_d439c836.webp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 hover:text-slate-900 underline flex items-center gap-1 font-semibold"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">

            <a
              href={EVENT_DETAILS.googleMapsDirectAddressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>House Pin</span>
            </a>

            <a
              href={EVENT_DETAILS.wazeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Car className="w-3.5 h-3.5 text-stone-500" />
              <span>Waze</span>
            </a>
          </div>

          {/* Copy Address Bar */}
          <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between gap-3 text-xs border border-stone-200">
            <div className="truncate">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">House Address</span>
              <span className="font-semibold text-slate-800 select-all truncate block">{EVENT_DETAILS.address}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-100 flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Minimal Dress Code & Calendar Reminder Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1 relative">
            <TapeStrip rotation="-rotate-3" className="absolute -top-2 left-6" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dress Code
            </span>
            <div className="font-bold text-slate-800 text-sm sm:text-base">
              &ldquo;House party at Emma&apos;s house&rdquo;
            </div>
            <p className="text-slate-500 italic text-xs">
              ...because idk wear whatever you want.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2 flex flex-col justify-between relative">
            <TapeStrip rotation="rotate-3" className="absolute -top-2 right-6" />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lock into Calendar
              </span>
              <div className="font-bold text-slate-800 text-sm sm:text-base">
                Saturday, Nov 21, 2026 @ 5:00 PM
              </div>
            </div>
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 hover:text-slate-900 underline font-semibold"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Google Calendar →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
