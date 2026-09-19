import React, { useEffect, useRef, useCallback } from 'react';
import Globe from 'globe.gl';
import { GlobalEvent } from '../../types';
import { DOMAIN_CONFIG, SEVERITY_CONFIG } from '../../config/domains';
import { useOrbitStore } from '../../store/orbitStore';

interface GlobeViewProps {
  onFlyToRef?: (fn: (lat: number, lng: number) => void) => void;
}

interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
  domain: string;
  severity: number;
  eventId: string;
  color: string;
  radius: number;
  altitude: number;
  event: GlobalEvent;
}

interface GlobeArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label?: string;
}

const SEVERITY_RADIUS: Record<number, number> = { 1: 0.3, 2: 0.4, 3: 0.55, 4: 0.7, 5: 0.9 };
const SEVERITY_ALTITUDE: Record<number, number> = { 1: 0.01, 2: 0.012, 3: 0.015, 4: 0.02, 5: 0.025 };

export const GlobeView: React.FC<GlobeViewProps> = ({ onFlyToRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof Globe> | null>(null);
  const { events, filters, selectEvent, arcs } = useOrbitStore();

  // Filter events
  const visibleEvents = events.filter(
    (e) =>
      filters.domains.includes(e.domain) && e.severity >= filters.minSeverity
  );

  // Build point data
  const pointData: GlobePoint[] = visibleEvents.map((e) => ({
    lat: e.lat,
    lng: e.lng,
    label: e.title,
    domain: e.domain,
    severity: e.severity,
    eventId: e.id,
    color: DOMAIN_CONFIG[e.domain].hex,
    radius: SEVERITY_RADIUS[e.severity] ?? 0.4,
    altitude: SEVERITY_ALTITUDE[e.severity] ?? 0.015,
    event: e,
  }));

  // Initialize Globe
  useEffect(() => {
    if (!mountRef.current) return;

    const globe = Globe()(mountRef.current);
    globeRef.current = globe;

    // Background
    globe.backgroundColor('rgba(0,0,0,0)');

    // Globe texture — dark ocean
    globe
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .atmosphereColor('#1e40af')
      .atmosphereAltitude(0.18)
      .showAtmosphere(true);

    // Points
    globe
      .pointsData([])
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointRadius('radius')
      .pointAltitude('altitude')
      .pointResolution(8)
      .pointLabel((d: object) => {
        const pt = d as GlobePoint;
        const domCfg = DOMAIN_CONFIG[pt.domain as keyof typeof DOMAIN_CONFIG];
        const sevCfg = SEVERITY_CONFIG[pt.severity as keyof typeof SEVERITY_CONFIG];
        return `
          <div class="globe-tooltip">
            <div style="color: ${domCfg.hex}; font-size: 11px; margin-bottom: 4px; font-family: monospace;">
              ${domCfg.icon} ${domCfg.label} · Severity ${pt.severity}/5
            </div>
            <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px; color: #e2e8f0;">${pt.label}</div>
          </div>
        `;
      })
      .onPointClick((d: object) => {
        const pt = d as GlobePoint;
        selectEvent(pt.event);
        globe.pointOfView({ lat: pt.lat, lng: pt.lng, altitude: 1.8 }, 1000);
      });

    // Arcs (cross-domain connections)
    globe
      .arcsData([])
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor('color')
      .arcAltitudeAutoScale(0.4)
      .arcStroke(0.5)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(2000);

    // Initial camera
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });

    // Controls
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableDamping = true;

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        globe.width(mountRef.current.clientWidth);
        globe.height(mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      globe._destructor?.();
    };
  }, []);

  // Update points when events/filters change
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointsData(pointData);
    }
  }, [visibleEvents]);

  // Update arcs
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.arcsData(arcs as GlobeArcData[]);
    }
  }, [arcs]);

  // Fly-to helper exposed to parent
  const flyTo = useCallback((lat: number, lng: number) => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView({ lat, lng, altitude: 1.8 }, 1200);
    }
  }, []);

  useEffect(() => {
    onFlyToRef?.(flyTo);
  }, [flyTo, onFlyToRef]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #020818 70%)' }}
    />
  );
};
