/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, Calendar, Clock, MapPin } from 'lucide-react';
import {
  PressedDaisy,
  PaperStar,
  RansomTitle,
  MedSchoolPolaroid,
  PawTrail,
  FlyingFrisbee,
  Stethoscope,
  CurlyDoodleArrow,
  TapeStrip,
} from './CollageElements';
import { EVENT_DETAILS } from '../data/partyDetails';

export const HeroWelcome: React.FC = () => {
  return (
    <section id="welcome" className="pt-6 sm:pt-10 pb-10 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Main Peg Scrapbook Poster Container */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/90 shadow-[4px_6px_0px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Top Decorative Peg Elements */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <PressedDaisy size={52} />
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <PaperStar size={44} />
          </div>

          {/* Peg Title: Ransom Cut-Out Letters */}
          <div className="text-center pt-6 sm:pt-4 space-y-2">
            <RansomTitle />
            <h2 className="text-slate-700 text-lg sm:text-xl font-bold tracking-tight">
              ...at her house
            </h2>
          </div>

          {/* Centerpiece: Clean Paper Cutout with Cat, Flying Frisbee, Stethoscope & Paw Prints */}
          <div className="relative my-6 py-2 flex items-center justify-center">
            {/* Med School Polaroid Taped on Left */}
            <div className="absolute left-0 sm:left-6 -top-2 z-20 hidden xs:block">
              <TapeStrip rotation="-rotate-6" className="-top-2 left-6" />
              <MedSchoolPolaroid />
            </div>

            {/* Bigger Paw Prints Trail leading towards Emma & Bunso */}
            <div className="absolute left-1 xs:left-4 sm:left-16 md:left-24 -bottom-1 sm:bottom-2 z-10 scale-90 sm:scale-100 origin-bottom-left">
              <PawTrail />
            </div>

            {/* Centerpiece: Emma & Bunso Frame (clean, no floating text) */}
            <div className="relative select-none">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full p-2 bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center overflow-hidden">
                <picture className="w-full h-full block">
                  <source srcSet="/assets/aistudio/emma_and_cat_570f15bb.webp" type="image/webp" />
                  <img
                    src="/assets/aistudio/emma_and_cat_570f15bb.jpg"
                    alt="Emma and Bunso"
                    className="w-full h-full object-cover object-[50%_35%] rounded-full"
                    loading="eager"
                  />
                </picture>
              </div>
            </div>

            {/* Flying Frisbee - High up in the air on the upper right with wind streaks */}
            <div className="absolute -top-7 sm:-top-9 md:-top-11 -right-2 xs:right-1 sm:right-5 md:right-8 z-20 transform -rotate-2 hover:rotate-3 hover:-translate-y-1 transition-all">
              <FlyingFrisbee width={96} height={52} className="sm:hidden" />
              <FlyingFrisbee width={118} height={62} className="hidden sm:block" />
            </div>

            {/* Stethoscope - Positioned further away at the lower right */}
            <div className="absolute -bottom-2 sm:bottom-0 md:bottom-2 -right-1 xs:right-2 sm:right-6 md:right-8 z-20 transform -rotate-6 hover:rotate-0 transition-transform">
              <TapeStrip rotation="rotate-6" className="-top-2 right-2 w-8 h-2.5 opacity-60" />
              <Stethoscope width={62} height={74} className="sm:hidden" />
              <Stethoscope width={74} height={88} className="hidden sm:block" />
            </div>
          </div>

          {/* Callout & Minimalist Pill Button */}
          <div className="text-center space-y-2.5 relative pt-1">
            <p className="text-base sm:text-lg text-slate-700 font-semibold">
              Can you make it? RSVP here!
            </p>

            {/* Doodle Curly Arrow pointing down */}
            <div className="flex justify-center -my-1">
              <CurlyDoodleArrow />
            </div>

            {/* Minimalist Pill Link Button */}
            <div className="pt-1">
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 rounded-full bg-[#1E3A5F] hover:bg-[#152B47] text-white px-6 sm:px-8 py-2.5 text-sm sm:text-base font-bold shadow-xs transition-all border border-[#152B47]"
              >
                <span>rsvp/emma-surprise-nov21-2026</span>
                <span className="text-sm">→</span>
              </a>
            </div>

            {/* Bottom-left muted star */}
            <div className="absolute -bottom-2 left-3 sm:left-8">
              <PaperStar size={30} />
            </div>
          </div>
        </div>

        {/* Essential Party Recon Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>Party Date</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              Saturday, Nov 21, 2026
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider mb-0.5">
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span>Arrival Goal</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              5:00 PM Sharp (Before Emma!)
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-600" />
              <span>Stealth Parking</span>
            </div>
            <div className="text-sm font-semibold text-slate-800 truncate">
              Palosapis St. Village Park
            </div>
          </div>
        </div>

        {/* Julio's Official Welcome Letter Pinned with Tape */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-xs space-y-4">
          <TapeStrip rotation="-rotate-3" className="absolute -top-2 left-10" />
          <TapeStrip rotation="rotate-3" className="absolute -top-2 right-10" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              A note from Julio
            </span>
            <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 font-medium">
              Top Secret Protocol
            </span>
          </div>

          <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base overflow-hidden">
            {/* Taped Polaroid Snapshot of Emma */}
            <div className="sm:float-right sm:ml-6 mb-4 flex justify-center">
              <div className="relative bg-[#FAF9F5] p-2.5 pb-4 rounded-sm shadow-[2px_3px_6px_rgba(0,0,0,0.1)] border border-stone-200 rotate-2 max-w-[190px] select-none">
                <TapeStrip rotation="-rotate-6" className="absolute -top-2 left-6" />
                <div className="aspect-[3/4] w-36 sm:w-40 overflow-hidden rounded-2xs bg-stone-100 border border-stone-200">
                  <picture className="w-full h-full block">
                    <source srcSet="/assets/aistudio/emma_in_temple_bcf2ee0e.webp" type="image/webp" />
                    <img
                      src="/assets/aistudio/emma_in_temple_bcf2ee0e.jpg"
                      alt="Emma"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="text-center mt-2 text-xs text-slate-600 font-medium">
                  The Birthday Girl ✨
                </div>
              </div>
            </div>

            <p className="font-extrabold text-slate-900 text-lg sm:text-xl">
              Welcome!
            </p>

            <p>
              If you&apos;re seeing this website, it means you have eyes. It also means you are very special to Emma, and she would love for you to come by unannounced to scream at her face inside the beloved safe space that she calls home.
            </p>

            <p>
              Emma obviously really loves being around you so please surprise her with a myocardial infarction (in a good way).
            </p>

            {/* Decoy Birthday Notice */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-slate-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                Her real birthday is on <strong>December 2, 2026</strong>, but I am planning this party on <strong>November 21, 2026</strong> as to not raise suspicion.
              </div>
            </div>

            <p>
              I thank you in advance for showing up because it would really mean so much to her!
            </p>

            <p className="text-slate-600 text-xs sm:text-sm">
              And if you really can&apos;t make it, please feel free to still leave a written message or video message for her down below.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                Thanks and I look forward to hanging with you all!
              </p>
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">
                — Julio
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
