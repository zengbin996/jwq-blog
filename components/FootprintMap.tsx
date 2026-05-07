'use client';

import React, { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import type { Footprint } from '@/lib/api';

interface Props {
  footprints: Footprint[];
}

export default function FootprintMap({ footprints }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [108, 35],
    zoom: 1,
  });

  const points = footprints.filter((fp) => fp.latitude && fp.longitude);

  const markerSize = Math.max(1.5, Math.min(5, 4 / position.zoom));
  const rippleSize = markerSize * 2.2;

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0d1117]" style={{ height: 'min(60vw, 600px)' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 750, center: [108, 35] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd} maxZoom={20}>
          <Geographies geography="/world.json">
            {({ geographies }: { geographies: import('react-simple-maps').Geography[] }) =>
              geographies.map((geo: import('react-simple-maps').Geography) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#0d1117"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#1e293b', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* China internal province boundaries overlay */}
          <Geographies geography="/china-provinces.json">
            {({ geographies }: { geographies: import('react-simple-maps').Geography[] }) =>
              geographies.map((geo: import('react-simple-maps').Geography) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="transparent"
                  stroke="#2d3f52"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {points.map((fp) => (
            <Marker
              key={fp.id}
              coordinates={[fp.longitude!, fp.latitude!]}
              onMouseEnter={(e: React.MouseEvent<SVGGElement>) => {
                const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                if (rect) {
                  setTooltip({
                    name: fp.city ?? fp.name,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle r={rippleSize} fill="#60a5fa" opacity={0.15}>
                <animate attributeName="r" from={markerSize} to={rippleSize * 1.6} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r={markerSize} fill="#60a5fa" stroke="#93c5fd" strokeWidth={0.5} />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 px-2.5 py-1.5 rounded-lg text-xs text-white bg-black/80 backdrop-blur-sm border border-white/10 whitespace-nowrap"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.name}
        </div>
      )}

      <div className="absolute bottom-3 right-3 text-xs text-white/30 select-none">scroll to zoom · drag to pan</div>
    </div>
  );
}
