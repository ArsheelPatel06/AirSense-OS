export type Severity = 'critical' | 'warning' | 'info';

export type LayerCategory = 'Environmental' | 'Weather' | 'Operations' | 'Infrastructure';

export interface Layer {
  id: string;
  label: string;
  active: boolean;
  color: string;
  category: LayerCategory;
}

export type SelectedEntity = 
  | { type: 'incident'; data: Incident }
  | { type: 'team'; data: ResponseTeam }
  | { type: 'sensor'; data: SensorNode }
  | { type: 'factory'; data: Factory }
  | { type: 'hospital'; data: Hospital }
  | null;

export interface Incident {
  id: string;
  severity: Severity;
  title: string;
  location: string;
  assigned: string;
  duration: string;
  status: string;
  x: number;
  y: number;
  rootCause?: string;
  actions?: string[];
}

export interface ResponseTeam {
  id: string;
  name: string;
  availability: 'Available' | 'Dispatched' | 'On Scene';
  task: string;
  eta: string;
  location: string;
  x: number;
  y: number;
}

export interface SensorNode {
  id: string;
  status: 'Online' | 'Offline' | 'Warning';
  mqtt: 'Connected' | 'Disconnected';
  gateway: string;
  x: number;
  y: number;
}

export interface Factory {
  id: string;
  name: string;
  industry: string;
  permitStatus: 'Valid' | 'Expired' | 'Suspended';
  emissionTrend: 'Stable' | 'Rising' | 'Spiking';
  lastInspection: string;
  x: number;
  y: number;
}

export interface Hospital {
  id: string;
  name: string;
  capacity: number;
  patients: number;
  airQualityStatus: 'Safe' | 'Compromised';
  x: number;
  y: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  type: string;
  x: number;
  y: number;
}
