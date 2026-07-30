export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low' | 'resolved';
export type IncidentStatus = 'Detected' | 'Verified' | 'Assigned' | 'Dispatched' | 'On Site' | 'Mitigation' | 'Monitoring' | 'Resolved' | 'Closed';
export type ActionPriority = 'high' | 'medium' | 'low';

export interface IncidentTeam {
  name: string;
  members: number;
  vehicle: string;
  eta: string;
  currentPosition: string;
  status: string;
  radio: string;
}

export interface IncidentTimelineEvent {
  time: string;
  action: string;
  status: string;
}

export interface RecommendedAction {
  priority: ActionPriority;
  title: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  location: string;
  zone: string;
  pollutant: string;
  reportedTime: string;
  elapsedTime: string;
  assignedTeam: IncidentTeam | null;
  status: IncidentStatus;
  
  details: {
    description: string;
    reportedBy: string;
    coordinates: string;
    affectedRadius: string;
    estimatedPopulation: string;
    currentAqi: number;
    peakReading: number;
    weather: {
      wind: string;
      weather: string;
      impact: string;
    };
    forecastRisk: string;
    sensitiveAreas: string[];
  };
  
  rootCause: {
    likelyCause: string;
    confidence: number;
    evidence: string[];
  };
  
  evidence: {
    sensorReadings: boolean;
    photos: number;
    droneImages: boolean;
    cameraFeed: boolean;
    historicalReadings: boolean;
  };
  
  timeline: IncidentTimelineEvent[];
  recommendedActions: RecommendedAction[];
  
  communication: {
    lastBroadcast: string;
    recipients: string;
    acknowledged: number;
    pending: number;
  };
  
  resources: {
    vehicle: string;
    portableSensors: number;
    drone: number;
    barrierUnits: number;
    staff: number;
  };
  
  opRecommendation: {
    points: string[];
    expectedImprovement: string;
    confidence: number;
  };
}

export const mockIncidents: Incident[] = [
  {
    id: 'OPS-4821',
    title: 'PM2.5 Spike',
    severity: 'critical',
    location: 'Industrial West',
    zone: 'Zone 4',
    pollutant: 'PM2.5',
    reportedTime: '13:05',
    elapsedTime: '18 min ago',
    assignedTeam: {
      name: 'Hazmat Alpha',
      members: 6,
      vehicle: 'Unit-14',
      eta: '4 mins',
      currentPosition: 'Highway 14',
      status: 'En Route',
      radio: 'Connected'
    },
    status: 'Dispatched',
    details: {
      description: 'Sudden PM2.5 spike detected across 4 interconnected sensors. Levels exceeded critical threshold of 150 µg/m³ for over 10 consecutive minutes.',
      reportedBy: 'Sensor Cluster A',
      coordinates: '23.0225° N, 72.5714° E',
      affectedRadius: '2.4 km',
      estimatedPopulation: '14,500',
      currentAqi: 168,
      peakReading: 192,
      weather: {
        wind: '12 km/h NE',
        weather: 'Cloudy',
        impact: 'Pushing plume toward residential sectors'
      },
      forecastRisk: 'High',
      sensitiveAreas: ['School', 'Hospital']
    },
    rootCause: {
      likelyCause: 'Unauthorized industrial venting',
      confidence: 91,
      evidence: ['Wind Direction correlation', 'Sensor Cluster 4A activation', 'Historical pattern match (shift change)']
    },
    evidence: {
      sensorReadings: true,
      photos: 4,
      droneImages: false,
      cameraFeed: true,
      historicalReadings: true
    },
    timeline: [
      { time: '13:05', action: 'Sensor exceeded threshold', status: 'Detected' },
      { time: '13:07', action: 'Incident created & verified', status: 'Verified' },
      { time: '13:10', action: 'Dispatcher assigned Alpha Team', status: 'Assigned' },
      { time: '13:18', action: 'Vehicle departed HQ', status: 'Dispatched' }
    ],
    recommendedActions: [
      { priority: 'high', title: 'Issue Public Advisory' },
      { priority: 'high', title: 'Deploy Mobile Sensor' },
      { priority: 'medium', title: 'Notify Municipal Authority' },
      { priority: 'low', title: 'Continue Monitoring' }
    ],
    communication: {
      lastBroadcast: '13:12 - Hazmat Alpha Dispatch',
      recipients: 'Field Ops, Zone Commander',
      acknowledged: 4,
      pending: 1
    },
    resources: {
      vehicle: '1 Heavy',
      portableSensors: 2,
      drone: 1,
      barrierUnits: 0,
      staff: 4
    },
    opRecommendation: {
      points: [
        'Deploy portable sensor downwind',
        'Increase sampling frequency to 1/min',
        'Notify health authority for Zone 4'
      ],
      expectedImprovement: 'AQI -40 in 2 hours',
      confidence: 92
    }
  },
  {
    id: 'OPS-4819',
    title: 'Traffic Congestion Emission',
    severity: 'high',
    location: 'Downtown Center',
    zone: 'Zone 1',
    pollutant: 'NO2',
    reportedTime: '12:45',
    elapsedTime: '45 min ago',
    assignedTeam: {
      name: 'Traffic Control Beta',
      members: 2,
      vehicle: 'Patrol 14',
      eta: 'On Site',
      currentPosition: 'Main St Intersection',
      status: 'Operating',
      radio: 'Connected'
    },
    status: 'Mitigation',
    details: {
      description: 'Sustained NO2 levels due to severe traffic gridlock caused by accident on main arterial road.',
      reportedBy: 'Traffic Integration Feed',
      coordinates: '23.0300° N, 72.5800° E',
      affectedRadius: '0.8 km',
      estimatedPopulation: '25,000',
      currentAqi: 156,
      peakReading: 162,
      weather: {
        wind: '5 km/h E',
        weather: 'Sunny',
        impact: 'Stagnant air compounding local buildup'
      },
      forecastRisk: 'Medium',
      sensitiveAreas: ['Downtown Clinic']
    },
    rootCause: {
      likelyCause: 'Traffic gridlock (Accident)',
      confidence: 98,
      evidence: ['Live traffic camera feed', 'NO2 sensor correlation', 'Time-of-day traffic model']
    },
    evidence: {
      sensorReadings: true,
      photos: 12,
      droneImages: true,
      cameraFeed: true,
      historicalReadings: true
    },
    timeline: [
      { time: '12:45', action: 'NO2 levels breached threshold', status: 'Detected' },
      { time: '12:50', action: 'Traffic accident verified', status: 'Verified' },
      { time: '12:55', action: 'Assigned Traffic Beta', status: 'Assigned' },
      { time: '13:00', action: 'Beta departed', status: 'Dispatched' },
      { time: '13:15', action: 'Beta on site', status: 'On Site' },
      { time: '13:25', action: 'Rerouting traffic initiated', status: 'Mitigation' }
    ],
    recommendedActions: [
      { priority: 'high', title: 'Implement Traffic Diversion' },
      { priority: 'medium', title: 'Coordinate with Police' },
      { priority: 'low', title: 'Update Digital Signage' }
    ],
    communication: {
      lastBroadcast: '13:20 - Traffic Reroute Order',
      recipients: 'Traffic Police, City Transit',
      acknowledged: 12,
      pending: 0
    },
    resources: {
      vehicle: '1 Light',
      portableSensors: 0,
      drone: 1,
      barrierUnits: 25,
      staff: 2
    },
    opRecommendation: {
      points: [
        'Divert commercial vehicles to Ring Road',
        'Adjust smart traffic lights pattern C',
        'Update public transit routing apps'
      ],
      expectedImprovement: 'AQI -50 in 1 hour',
      confidence: 88
    }
  },
  {
    id: 'OPS-4818',
    title: 'Construction Dust Cloud',
    severity: 'medium',
    location: 'North Expansion Zone',
    zone: 'Zone 3',
    pollutant: 'PM10',
    reportedTime: '11:20',
    elapsedTime: '2 hrs ago',
    assignedTeam: {
      name: 'Field Inspection Delta',
      members: 2,
      vehicle: 'Utility 05',
      eta: 'On Site',
      currentPosition: 'Block 42',
      status: 'Monitoring',
      radio: 'Disconnected'
    },
    status: 'Monitoring',
    details: {
      description: 'Large particulate matter (PM10) localized spike near new commercial district excavation site.',
      reportedBy: 'Public Complaint & Sensor',
      coordinates: '23.0500° N, 72.5600° E',
      affectedRadius: '0.5 km',
      estimatedPopulation: '3,200',
      currentAqi: 112,
      peakReading: 140,
      weather: {
        wind: '18 km/h S',
        weather: 'Dry',
        impact: 'Blowing dust towards residential block'
      },
      forecastRisk: 'Medium',
      sensitiveAreas: ['Public Park']
    },
    rootCause: {
      likelyCause: 'Uncovered excavation activity',
      confidence: 95,
      evidence: ['Direct visual confirmation', 'PM10 specific spike', 'Active construction permit']
    },
    evidence: {
      sensorReadings: true,
      photos: 2,
      droneImages: false,
      cameraFeed: false,
      historicalReadings: true
    },
    timeline: [
      { time: '11:20', action: 'Multiple PM10 alerts', status: 'Detected' },
      { time: '11:30', action: 'Visual confirmation via complaint', status: 'Verified' },
      { time: '11:35', action: 'Delta team assigned', status: 'Assigned' },
      { time: '11:55', action: 'Delta on site', status: 'On Site' },
      { time: '12:10', action: 'Water spraying enforced', status: 'Mitigation' },
      { time: '12:30', action: 'Dust settling, observing levels', status: 'Monitoring' }
    ],
    recommendedActions: [
      { priority: 'medium', title: 'Issue Contractor Fine' },
      { priority: 'medium', title: 'Schedule Follow-up Visit' },
      { priority: 'low', title: 'Log Incident for Compliance' }
    ],
    communication: {
      lastBroadcast: '12:15 - Dust Suppression Active',
      recipients: 'Env Protection Board',
      acknowledged: 1,
      pending: 0
    },
    resources: {
      vehicle: '1 Light',
      portableSensors: 1,
      drone: 0,
      barrierUnits: 0,
      staff: 2
    },
    opRecommendation: {
      points: [
        'Mandate continuous water spraying',
        'Review contractor history for repeat offenses'
      ],
      expectedImprovement: 'AQI -25 in 30 mins',
      confidence: 95
    }
  },
  {
    id: 'OPS-4815',
    title: 'Chemical Odor Complaint',
    severity: 'resolved',
    location: 'Eastern Suburbs',
    zone: 'Zone 2',
    pollutant: 'VOCs',
    reportedTime: '08:15',
    elapsedTime: '5 hrs ago',
    assignedTeam: null,
    status: 'Resolved',
    details: {
      description: 'Multiple citizen reports of strong chemical odor. Sensors showed brief VOC spike.',
      reportedBy: 'Citizen App',
      coordinates: '23.0100° N, 72.6000° E',
      affectedRadius: '1.2 km',
      estimatedPopulation: '18,000',
      currentAqi: 45,
      peakReading: 85,
      weather: {
        wind: '8 km/h NW',
        weather: 'Clear',
        impact: 'Cleared by mid-morning breeze'
      },
      forecastRisk: 'Low',
      sensitiveAreas: []
    },
    rootCause: {
      likelyCause: 'Legal scheduled venting (Plant B)',
      confidence: 99,
      evidence: ['Venting schedule log', 'VOC sensor decay curve']
    },
    evidence: {
      sensorReadings: true,
      photos: 0,
      droneImages: false,
      cameraFeed: false,
      historicalReadings: true
    },
    timeline: [
      { time: '08:15', action: 'Odor complaints received', status: 'Detected' },
      { time: '08:30', action: 'Correlated with VOC spike', status: 'Verified' },
      { time: '08:45', action: 'Checked venting schedules', status: 'Mitigation' },
      { time: '09:00', action: 'Confirmed legal venting, monitoring decay', status: 'Monitoring' },
      { time: '10:15', action: 'Levels normalized', status: 'Resolved' }
    ],
    recommendedActions: [
      { priority: 'low', title: 'File Final Report' },
      { priority: 'low', title: 'Close Incident' }
    ],
    communication: {
      lastBroadcast: '10:20 - All Clear',
      recipients: 'Public App Users, Zone 2 Command',
      acknowledged: 5,
      pending: 0
    },
    resources: {
      vehicle: 'None',
      portableSensors: 0,
      drone: 0,
      barrierUnits: 0,
      staff: 1
    },
    opRecommendation: {
      points: [
        'Update citizen app with "Scheduled Venting" notification to prevent future panics',
        'Review plant communication protocols'
      ],
      expectedImprovement: 'Stable',
      confidence: 100
    }
  }
];
