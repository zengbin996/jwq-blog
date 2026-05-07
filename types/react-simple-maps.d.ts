declare module 'react-simple-maps' {
  import type { ReactNode, MouseEvent } from 'react';

  export interface GeographyProps {
    key?: string;
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties & { outline?: string };
      hover?: React.CSSProperties & { outline?: string };
      pressed?: React.CSSProperties & { outline?: string };
    };
  }

  export interface Geography {
    rsmKey: string;
    properties: Record<string, string>;
    [key: string]: unknown;
  }

  export interface GeographiesRenderProps {
    geographies: Geography[];
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: GeographiesRenderProps) => ReactNode;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onMouseEnter?: (e: MouseEvent<SVGGElement>) => void;
    onMouseLeave?: (e: MouseEvent<SVGGElement>) => void;
    onClick?: (e: MouseEvent<SVGGElement>) => void;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    center?: [number, number];
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMoveStart?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (position: { x: number; y: number; dragging: boolean; zoom: number }) => void;
    children?: ReactNode;
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
      parallels?: [number, number];
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface GraticuleProps {
    stroke?: string;
    strokeWidth?: number;
    step?: [number, number];
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
  export function Sphere(props: SphereProps): JSX.Element;
  export function Graticule(props: GraticuleProps): JSX.Element;
}
