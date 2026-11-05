/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CatProfile } from '../types';

export const EVENT_DETAILS = {
  guestOfHonor: 'Emma',
  organizer: 'Julio',
  partyDate: '2026-11-21',
  partyTime: '5:00 PM Sharp',
  guestArrivalGoal: 'Before 5:00 PM (to hide before Emma gets home!)',
  realBirthday: 'December 2, 2026',
  venueName: "Emma's House",
  address: '3063 Lauan Extension, United Paranaque Subdivision 2, East Service Road, Parañaque City',
  parkingLocation: 'Village Park on Palosapis St., United Paranaque Subdivision 2 (UPS 2)',
  parkingReason: "Guests need to park there so it is not suspicious. Please park at the parking spaces at the village park on Palosapis St., United Paranaque Subdivision 2, then you can just walk 100 meters down Lauan Extension to Emma's house.",
  dressCode: '"house party at emma\'s house" because idk wear whatever you want.',
  welcomeQuote: `Welcome!
If you're seeing this website, it means you have eyes. It also means you are very special to Emma, and she would love for you to come by unannounced to scream at her face inside the beloved safe space that she calls home.

Emma obviously really loves being around you so please surprise her with a myocardial infarction (in a good way).

Her real birthday is on December 2, 2026, but I am planning this party on November 21, 2026 as to not raise suspicion.

I thank you in advance for showing up because it would really mean so much to her!

And if you really can't make it, please feel free to still leave a written message or video message for her down below.

Thanks and I look forward to hanging with you all!`,
  googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&origin=Palosapis+St+Park+United+Paranaque+Subdivision+2+Paranaque&destination=3063+Lauan+Extension+United+Paranaque+Subdivision+2+East+Service+Road+Paranaque+City&travelmode=walking',
  googleMapsDirectAddressUrl: 'https://maps.app.goo.gl/ULD7WGNf4m6pJQ3H9',
  wazeSearchUrl: 'https://waze.com/ul/hwdw46qx6x',
  defaultTelegramUrl: 'https://t.me/+kX27iNvLJ0wyYWFl',
  defaultSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbzhmi_Ln2QWLq0qUneEvEE8dudJNN7mlcGDQEe3GAcMnXf1emm0FpbCUS5RjlYeUpWwOQ/exec',
};


export const RESIDENT_CATS: CatProfile[] = [
  {
    id: 'cat-1',
    name: 'Mochi',
    title: 'The Silent Loaf Master',
    personality: 'Thinks everything in med school is an excuse for a 4-hour snooze.',
    favoriteSpot: 'Under the master bed duvet or clean laundry pile',
    appearanceLikelihood: '15% (Will observe from behind a cracked door)',
    medSchoolDiagnosis: 'Chronic somnolence treated with head scratches',
    avatarColor: 'bg-amber-100 text-amber-900 border-amber-300',
    badge: 'Senior Loaf',
    quote: '"If you scream \'Surprise!\' too loud, I will stare at you from the shadows with quiet judgment."',
  },
  {
    id: 'cat-2',
    name: 'Boba',
    title: 'The Void Ninja',
    personality: '99% stealth, 1% golden eyes blinking in the dark hallway.',
    favoriteSpot: 'The deepest cardboard box in the house',
    appearanceLikelihood: '8% (You will feel a presence, but never see him)',
    medSchoolDiagnosis: 'Acute darkness camouflage syndrome',
    avatarColor: 'bg-slate-900 text-slate-100 border-slate-700',
    badge: 'Shadow Operative',
    quote: '"I was at the party the whole time. You just didn\'t have high enough perception stats."',
  },
  {
    id: 'cat-3',
    name: 'Cleo',
    title: 'The Stethoscope Inspector',
    personality: 'Obsessed with chewing rubber cords and sitting on open pathology textbooks.',
    favoriteSpot: 'Emma’s desk chair the second she stands up to stretch',
    appearanceLikelihood: '40% (Might investigate if tuna or cheese is present)',
    medSchoolDiagnosis: 'Obsessive Study Buddy Tendencies',
    avatarColor: 'bg-pink-100 text-pink-900 border-pink-300',
    badge: 'Chief Resident Cat',
    quote: '"I reviewed Emma’s clinical flashcards. She passed. Now feed me Churu treats."',
  },
  {
    id: 'cat-4',
    name: 'Oliver',
    title: 'The Frisbee Strategist',
    personality: 'Loves tracking spinning discs from the living room window.',
    favoriteSpot: 'The sunspot by the glass sliding door',
    appearanceLikelihood: '25% (May appear during cocktail hour if someone drops ice)',
    medSchoolDiagnosis: 'High-speed disc ocular tracking reflex: 10/10',
    avatarColor: 'bg-sky-100 text-sky-900 border-sky-300',
    badge: 'Defense Wing',
    quote: '"Throw the frisbee outside, but please do not disturb my sunbeam alignment."',
  },
  {
    id: 'cat-5',
    name: 'Luna',
    title: 'The Nintendo Joy-Con Critic',
    personality: 'Attracted to Animal Crossing town melodies and Mario Kart finish horns.',
    favoriteSpot: 'Curled on top of the warm TV router box',
    appearanceLikelihood: '30% (Likes chill acoustic beach guitar and laughter)',
    medSchoolDiagnosis: 'Hyper-resonance to 8-bit chiptune soundwaves',
    avatarColor: 'bg-violet-100 text-violet-900 border-violet-300',
    badge: 'Gamer Feline',
    quote: '"Press A to pet me. If you press B, I will gently swat your knuckle."',
  },
  {
    id: 'cat-6',
    name: 'Simba',
    title: 'The Golden Sunshine Watchman',
    personality: 'The brave one who might actually sniff your shoe for 3 seconds before vanishing.',
    favoriteSpot: 'The top stair overlooking the front entryway',
    appearanceLikelihood: '65% (Most likely to greet the stealth party guests!)',
    medSchoolDiagnosis: 'Cardiomegaly (his heart is too big and loving)',
    avatarColor: 'bg-yellow-100 text-yellow-900 border-yellow-400',
    badge: 'Party Sentinel',
    quote: '"I am guarding the door. State the secret password: \'Tuna & Discs\'."',
  },
];

export const PARTY_THEMES = [
  {
    key: 'cats',
    title: '6 Resident Cats',
    tagline: 'Guaranteed presence, questionable visibility',
    icon: '🐱',
    color: 'from-amber-200 to-yellow-300 text-amber-900',
    desc: 'Six royal felines call this house their sanctuary. They might inspect your shoes, or hide under beds for 4 hours.',
  },
  {
    key: 'frisbee',
    title: 'Ultimate Frisbee Spirit',
    tagline: 'Layouts, flick passes & disc vibes',
    icon: '🥏',
    color: 'from-sky-200 to-blue-300 text-sky-900',
    desc: 'Emma’s love for ultimate frisbee—bring your quick sprint reflexes for the surprise scream!',
  },
  {
    key: 'med',
    title: 'Med School Survivalist',
    tagline: 'Future Doctor Emma / Rx Prescription: Fun',
    icon: '🩺',
    color: 'from-pink-200 to-rose-300 text-pink-900',
    desc: 'Prescription for stress relief: 100% wholesome chaos with her favorite humans and zero anatomy exams.',
  },
  {
    key: 'nintendo',
    title: 'Nintendo Gamer Heart',
    tagline: 'Animal Crossing cozy + Mario Kart speed',
    icon: '🎮',
    color: 'from-yellow-200 to-amber-300 text-yellow-950',
    desc: 'Secret quest unlocked! Complete the objective by hiding in the living room before Emma arrives.',
  },
  {
    key: 'beach',
    title: 'Beach & Coastal Vibe',
    tagline: 'Sunset coolers, good snacks & tropical glow',
    icon: '🏖️',
    color: 'from-blue-200 to-cyan-300 text-cyan-950',
    desc: 'Casual house party warmth—sand in spirit, chilled beverages, and sun-kissed memories.',
  },
];
