'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      if (typeof window !== 'undefined') {
        const w = window as any;
        if (typeof w.SPInitSite === 'function') {
          w.SPInitSite();
        }
        if (typeof w.SPInitPage === 'function') {
          w.SPInitPage(document);
        }
      }
    };

    const timer = setTimeout(run, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

