export type ResourceStatus = 'Available' | 'Assigned' | 'En Route' | 'On Site' | 'Returning' | 'Maintenance' | 'Offline';
export type ResourceCategory = 'Personnel' | 'Mobile Units' | 'Equipment';
export type ResourceType = 'Hazmat' | 'Traffic' | 'Environmental' | 'Command' | 'Medical' | 'Command Van' | 'Mobile Lab' | 'Sensor Van' | 'Portable Sensor' | 'Drone' | 'Gateway' | 'Communications';

export interface ResourceCapability {
  name: string;
  icon: string; // We'll map this in UI
}

export interface ResourceTimelineEvent {
  time: string;
  status: ResourceStatus;
  description: string;
}

export interface OperationsResource {
  id: string;
  name: string;
  category: ResourceCategory;
  type: ResourceType;
  status: ResourceStatus;
  
  // Mission Data
  currentAssignment: string | null;
  locationDesc: string;
  missionPriority: 'Critical' | 'High' | 'Medium' | 'Low' | null;
  missionStarted: string | null;
  missionElapsed: string | null;
  eta: string | null;
  etaFinish: string | null;
  commander: string | null;
  missionProgress: number | null;
  
  // Dynamic Operational Metrics (Nullable depending on type)
  shiftRemaining: string | null;
  batteryLevel: number | null;
  fuelLevel: number | null;
  radioStatus: 'Connected' | 'Disconnected' | 'Offline' | null;
  lastMaintenance: string | null;
  members: number | null;
  vehicleAssigned: string | null;
  
  // Equipment specific
  signalStrength: string | null;
  flightTime: string | null;
  firmware: string | null;
  calibration: string | null;
  
  capabilities: ResourceCapability[];
  
  // History
  history: {
    lastMission: string;
    lastMissionDate: string;
    avgResponseTime: string;
    completedMissions: number;
    successRate: string;
  };
}

export const MOCK_RESOURCES: OperationsResource[] = [
  {
    id: 'RES-P-001',
    name: 'Hazmat Alpha',
    category: 'Personnel',
    type: 'Hazmat',
    status: 'On Site',
    currentAssignment: 'OPS-4821',
    locationDesc: 'Industrial West',
    missionPriority: 'Critical',
    missionStarted: '10:14',
    missionElapsed: '2h 18m',
    eta: null,
    etaFinish: '14:45',
    commander: 'John Patel',
    missionProgress: 62,
    
    shiftRemaining: '5h 30m',
    batteryLevel: null,
    fuelLevel: 82,
    members: 6,
    vehicleAssigned: 'Unit-14',
    radioStatus: 'Connected',
    lastMaintenance: '2 days ago',
    
    signalStrength: null,
    flightTime: null,
    firmware: null,
    calibration: null,
    
    capabilities: [
      { name: 'Chemical Spill', icon: 'flask' },
      { name: 'Biohazard', icon: 'biohazard' },
      { name: 'Decontamination', icon: 'shower' }
    ],
    history: {
      lastMission: 'Industrial Fire',
      lastMissionDate: 'Yesterday',
      avgResponseTime: '6 min',
      completedMissions: 142,
      successRate: '98%'
    }
  },
  {
    id: 'RES-P-003',
    name: 'Traffic North',
    category: 'Personnel',
    type: 'Traffic',
    status: 'Assigned',
    currentAssignment: 'Sector 4 Blockade',
    locationDesc: 'North Avenue',
    missionPriority: 'High',
    missionStarted: '13:18',
    missionElapsed: '1h 05m',
    eta: '4 min',
    etaFinish: '18:00',
    commander: 'Sarah Jenkins',
    missionProgress: 15,
    
    shiftRemaining: '4h 45m',
    batteryLevel: null,
    fuelLevel: 65,
    members: 4,
    vehicleAssigned: 'Cruiser-08',
    radioStatus: 'Connected',
    lastMaintenance: '1 week ago',
    
    signalStrength: null,
    flightTime: null,
    firmware: null,
    calibration: null,
    
    capabilities: [
      { name: 'Road Closure', icon: 'barrier' },
      { name: 'Traffic Control', icon: 'police' },
      { name: 'Emergency Routing', icon: 'route' }
    ],
    history: {
      lastMission: 'Highway Accident',
      lastMissionDate: '2 days ago',
      avgResponseTime: '4 min',
      completedMissions: 310,
      successRate: '99%'
    }
  },
  {
    id: 'RES-E-001',
    name: 'Drone Echo',
    category: 'Equipment',
    type: 'Drone',
    status: 'Maintenance',
    currentAssignment: null,
    locationDesc: 'Workshop A',
    missionPriority: null,
    missionStarted: null,
    missionElapsed: null,
    eta: null,
    etaFinish: null,
    commander: null,
    missionProgress: null,
    
    shiftRemaining: null,
    batteryLevel: 15,
    fuelLevel: null,
    members: null,
    vehicleAssigned: null,
    radioStatus: 'Disconnected',
    lastMaintenance: 'Today',
    
    signalStrength: 'None',
    flightTime: '45 mins max',
    firmware: 'v3.2.1',
    calibration: 'Required',
    
    capabilities: [
      { name: 'Thermal Camera', icon: 'flame' },
      { name: 'Optical 4K', icon: 'camera' },
      { name: 'Gas Sniffer', icon: 'wind' }
    ],
    history: {
      lastMission: 'Factory Surveillance',
      lastMissionDate: 'Today',
      avgResponseTime: '2 min',
      completedMissions: 85,
      successRate: '95%'
    }
  },
  {
    id: 'RES-E-003',
    name: 'Air Sensor Kit 18',
    category: 'Equipment',
    type: 'Portable Sensor',
    status: 'Available',
    currentAssignment: null,
    locationDesc: 'Warehouse B',
    missionPriority: null,
    missionStarted: null,
    missionElapsed: null,
    eta: null,
    etaFinish: null,
    commander: null,
    missionProgress: null,
    
    shiftRemaining: null,
    batteryLevel: 98,
    fuelLevel: null,
    members: null,
    vehicleAssigned: null,
    radioStatus: 'Offline',
    lastMaintenance: '2 months ago',
    
    signalStrength: '95%',
    flightTime: null,
    firmware: 'v1.0.4',
    calibration: 'Valid (12 days left)',
    
    capabilities: [
      { name: 'PM1.0 / PM2.5', icon: 'particulate' },
      { name: 'VOC', icon: 'chemical' },
      { name: 'Solar Powered', icon: 'sun' }
    ],
    history: {
      lastMission: 'Downtown Event Monitoring',
      lastMissionDate: 'Last Week',
      avgResponseTime: 'N/A',
      completedMissions: 24,
      successRate: '100%'
    }
  }
];

export const INCIDENT_SUMMARIES = [
  { id: 'OPS-4821', title: 'Industrial Fire - West', priority: 'Critical', location: 'Industrial West' },
  { id: 'OPS-4822', title: 'Chemical Spill', priority: 'High', location: 'Highway 4' },
  { id: 'OPS-4823', title: 'Suspicious Odor', priority: 'Medium', location: 'Residential East' },
];
