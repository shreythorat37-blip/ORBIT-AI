declare module 'globe.gl' {
  interface GlobeInstance {
    (element: HTMLElement): GlobeInstance;
    // Background
    backgroundColor(color: string): GlobeInstance;
    // Globe imagery
    globeImageUrl(url: string): GlobeInstance;
    bumpImageUrl(url: string): GlobeInstance;
    showAtmosphere(show: boolean): GlobeInstance;
    atmosphereColor(color: string): GlobeInstance;
    atmosphereAltitude(alt: number): GlobeInstance;
    // Points
    pointsData(data: object[]): GlobeInstance;
    pointLat(accessor: string | ((d: object) => number)): GlobeInstance;
    pointLng(accessor: string | ((d: object) => number)): GlobeInstance;
    pointColor(accessor: string | ((d: object) => string)): GlobeInstance;
    pointRadius(accessor: string | ((d: object) => number)): GlobeInstance;
    pointAltitude(accessor: string | ((d: object) => number)): GlobeInstance;
    pointResolution(res: number): GlobeInstance;
    pointLabel(accessor: string | ((d: object) => string)): GlobeInstance;
    onPointClick(cb: (d: object, event: MouseEvent) => void): GlobeInstance;
    // Arcs
    arcsData(data: object[]): GlobeInstance;
    arcStartLat(accessor: string | ((d: object) => number)): GlobeInstance;
    arcStartLng(accessor: string | ((d: object) => number)): GlobeInstance;
    arcEndLat(accessor: string | ((d: object) => number)): GlobeInstance;
    arcEndLng(accessor: string | ((d: object) => number)): GlobeInstance;
    arcColor(accessor: string | ((d: object) => string | string[])): GlobeInstance;
    arcAltitudeAutoScale(scale: number): GlobeInstance;
    arcStroke(accessor: string | number | ((d: object) => number)): GlobeInstance;
    arcDashLength(len: number): GlobeInstance;
    arcDashGap(gap: number): GlobeInstance;
    arcDashAnimateTime(ms: number): GlobeInstance;
    // Camera
    pointOfView(pov: { lat: number; lng: number; altitude: number }, durationMs?: number): GlobeInstance;
    // Dimensions
    width(w: number): GlobeInstance;
    height(h: number): GlobeInstance;
    // Controls
    controls(): {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableDamping: boolean;
    };
    // Cleanup
    _destructor?(): void;
  }

  function Globe(): GlobeInstance;
  export = Globe;
}
