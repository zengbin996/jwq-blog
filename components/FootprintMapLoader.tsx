'use client';

import dynamic from 'next/dynamic';
import type { Footprint } from '@/lib/api';

const FootprintMap = dynamic(() => import('./FootprintMap'), { ssr: false });

export default function FootprintMapLoader({ footprints }: { footprints: Footprint[] }) {
  return <FootprintMap footprints={footprints} />;
}
