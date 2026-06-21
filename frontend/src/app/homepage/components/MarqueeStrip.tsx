'use client';

import Marquee from '@/components/motion/Marquee';

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Tamil',
  'Computer Science', 'Commerce', 'JEE Foundation', 'NEET Foundation',
  'NTSE', 'Olympiads', 'Vedic Maths',
];

const MarqueeStrip = () => {
  return (
    <div className="bg-navy py-4 sm:py-5 border-y border-white/10">
      <Marquee duration={40}>
        {subjects.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-7 font-display text-lg sm:text-xl text-navy-foreground/85"
          >
            {s}
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default MarqueeStrip;
