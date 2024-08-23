'use client'
import { useEffect, useRef, useState } from "react";

export const useScrollTo = <T extends Element>() => {
    const ref = useRef<{ [key: string]: T | null }>({});
    const [shouldScrollTo, setShouldScrollTo] = useState<string | null>(null);
  
    useEffect(() => {
      if (ref.current && shouldScrollTo) {
        ref.current[shouldScrollTo]?.scrollIntoView({ behavior: 'smooth' });
        setShouldScrollTo(null);
      }
    }, [shouldScrollTo]);
  
    return [ref, setShouldScrollTo] as const;
  };