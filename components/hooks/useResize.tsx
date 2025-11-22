"use client";
import { useEffect, useState } from 'react';

/*

THE RESIZE HOOK USED 

*/

export default function useResize() {
  const [size, setSize] = useState<{ x: number, y: number }>({ x: 0, y: 0 });


  useEffect(() => {

    if (typeof window != "undefined") {

      setSize(
        {
          x: typeof window !== 'undefined' ? window.innerWidth : 1920,
          y: typeof window !== 'undefined' ? window.innerHeight : 1080,
        }
      )
      const handleResize = () => {
        setSize({
          x: window.innerWidth,
          y: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
      
    }

  }, []);

  return size;
};