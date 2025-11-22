import React from 'react';

const Logo = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  // Define colors based on theme
  const textColor = isLight ? 'text-gray-400' : 'text-gray-900';
  const lineColor = isLight ? 'bg-gray-400' : 'bg-gray-800';

  return (
    <div className="flex place-content-center mt-[30px] select-none font-[Felix]">
      <div className="w-full flex items-center justify-center py-10 bg-transparent">
        <div className="relative flex flex-col items-center justify-center text-center">

          {/* BISERICA */}
          <div
            className={
              textColor +
              ' font-[Felix_Titling] -ml-1 uppercase font-bold text-[clamp(7px,1.6vw,9px)]'
            }
          >
            biserica
          </div>

          {/* FOIȘORUL with lines */}
          <div
            className={
              textColor +
              ' font-serif uppercase tracking-[0.10em] leading-tight select-none relative flex items-center justify-center gap-3'
            }
          >
            <div
              className={
                'h-[0.8px] w-[60px] rounded-full translate-y-[7px] ' + lineColor
              }
            />
            <span className="text-[clamp(12px,2vw,13px)] font-[Felix_Titling]">FOISORUL</span>
            <div
              className={
                'h-[0.8px] w-[60px] rounded-full translate-y-[7px] ' + lineColor
              }
            />
          </div>

          {/* MAVROCORDATILOR */}
          <div
            className={
              textColor +
              ' font-[Felix_Titling] uppercase tracking-[0.15em] text-[clamp(11px,1.6vw,12px)]'
            }

          >
          MAVROCORDATILOR
        </div>

      </div>
    </div>
    </div >
  );
};

export default Logo;
