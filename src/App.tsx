import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './platforms/public/Home';
import { Login } from './platforms/auth/Login';
import { AppShell } from './app/layouts/AppShell/AppShell';
import { Breadcrumb } from './shared/ui/Breadcrumbs/Breadcrumb';
import { ProtectedRoute } from './app/layouts/AppShell/ProtectedRoute';

import { FleetOverview } from './platforms/enterprise/iot/pages/FleetOverview';
import { FleetDetails } from './platforms/enterprise/iot/pages/FleetDetails';
import { DeviceList } from './platforms/enterprise/iot/pages/DeviceList';
import { DeviceDetailsLayout } from './platforms/enterprise/iot/pages/device/DeviceDetailsLayout';
import { DeviceOverviewTab } from './platforms/enterprise/iot/pages/device/tabs/DeviceOverviewTab';
import { DeviceTelemetryTab } from './platforms/enterprise/iot/pages/device/tabs/DeviceTelemetryTab';
import { DeviceFirmwareTab } from './platforms/enterprise/iot/pages/device/tabs/DeviceFirmwareTab';
import { DeviceDiagnosticsTab } from './platforms/enterprise/iot/pages/device/tabs/DeviceDiagnosticsTab';
import { DeviceHistoryTab } from './platforms/enterprise/iot/pages/device/tabs/DeviceHistoryTab';
import { DeviceConfigurationTab } from './platforms/enterprise/iot/pages/device/tabs/DeviceConfigurationTab';
import { DeviceComparison } from './platforms/enterprise/iot/pages/DeviceComparison';
import { FleetAnalytics } from './platforms/enterprise/iot/pages/FleetAnalytics';
import { FleetComparison } from './platforms/enterprise/iot/pages/FleetComparison';
import { IncidentDetails } from './platforms/enterprise/iot/pages/IncidentDetails';
import { AlertsCenter } from './platforms/enterprise/iot/pages/AlertsCenter';
import { SettingsWorkspace } from './platforms/enterprise/iot/pages/SettingsWorkspace';
import { OperationsMap } from './platforms/enterprise/operations/pages/OperationsMap/index';
import { EnvironmentalMonitoring } from './platforms/enterprise/operations/pages/EnvironmentalMonitoring';
import { Dashboard as OpsDashboard } from './platforms/enterprise/operations/pages/Dashboard/index';
import { ForecastWorkspace } from './platforms/enterprise/operations/pages/ForecastWorkspace';
import { IncidentCenter } from './platforms/enterprise/operations/pages/IncidentCenter/IncidentCenter';
import { ResponseResources } from './platforms/enterprise/operations/pages/ResponseResources';

import { AlertsWorkspace } from './platforms/enterprise/operations/pages/AlertsCenter/AlertsWorkspace';
import { SettingsWorkspace as OpsSettingsWorkspace } from './platforms/enterprise/operations/pages/SettingsWorkspace';
import { ComplianceWorkspace } from './platforms/enterprise/operations/pages/ComplianceWorkspace';

import { ExecutiveDashboard } from './platforms/enterprise/government/pages/ExecutiveDashboard';
import { CitizenCommunication } from './platforms/enterprise/government/pages/CitizenCommunication';
import { Compliance as GovCompliance } from './platforms/enterprise/government/pages/Compliance';
import { ProjectsPlanning } from './platforms/enterprise/government/pages/ProjectsPlanning';
import { Reports as GovReports } from './platforms/enterprise/government/pages/Reports';
import { Settings as GovSettings } from './platforms/enterprise/government/pages/Settings';
import { GovProvider } from './platforms/enterprise/government/context/GovContext';
import { OpsProvider } from './platforms/enterprise/operations/context/OpsContext';
import { IotProvider } from './platforms/enterprise/iot/context/IotContext';

function SkeletonDashboard({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-iot-text-primary)] tracking-tight">{title}</h1>
          <p className="text-[13px] text-[var(--color-iot-text-secondary)] mt-1">Real-time monitoring and analytics</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[var(--color-iot-border)] rounded-xl bg-[#F1F5F9] shadow-inner">
        <div className="text-center">
          <p className="text-[var(--color-iot-text-secondary)] font-medium mb-2">Development Preview</p>
          <p className="text-[var(--color-iot-text-primary)] font-bold text-lg">{title} Interface</p>
          <p className="text-[var(--color-iot-text-muted)] text-[12px] mt-2 max-w-sm mx-auto">This section is currently using a static prototype placeholder and will be replaced with realistic mock data soon.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedPlatforms={['citizen', 'iot', 'operations', 'government']}>
          <AppShell />
        </ProtectedRoute>
      } />
      
      {/* Enterprise Shell Routes */}
      <Route element={<ProtectedRoute allowedPlatforms={['iot']} />}>
        <Route path="/iot" element={<IotProvider><AppShell /></IotProvider>}>
          {/* Redirect base to fleets */}
          <Route index element={<Navigate to="/iot/fleets" replace />} />
        
        {/* Fleets */}
        <Route path="fleets" element={<FleetOverview />} />
        <Route path="fleets/compare" element={<FleetComparison />} />
        <Route path="fleets/:fleetId" element={<FleetDetails />} />
        <Route path="fleets/:fleetId/analytics" element={<SkeletonDashboard title="Fleet Analytics" />} />
        
        {/* Devices */}
        <Route path="devices" element={<DeviceList />} />
        <Route path="devices/compare" element={<DeviceComparison />} />
        <Route path="devices/:deviceId" element={<DeviceDetailsLayout />}>
          <Route index element={<DeviceOverviewTab />} />
          <Route path="telemetry" element={<DeviceTelemetryTab />} />
          <Route path="firmware" element={<DeviceFirmwareTab />} />
          <Route path="diagnostics" element={<DeviceDiagnosticsTab />} />
          <Route path="history" element={<DeviceHistoryTab />} />
          <Route path="configuration" element={<DeviceConfigurationTab />} />
        </Route>
        
        {/* Alerts & Incidents */}
        <Route path="alerts" element={<AlertsCenter />} />
        <Route path="alerts/:incidentId" element={<IncidentDetails />} />
        
        {/* Analytics & Reports */}
        <Route path="analytics" element={<FleetAnalytics />} />
        <Route path="reports" element={<SkeletonDashboard title="Reports" />} />
        <Route path="settings" element={<SettingsWorkspace />} />
        </Route>
      </Route>

      {/* Operations Platform — shares AppShell, gets ops nav config + ops theme */}
      <Route element={<ProtectedRoute allowedPlatforms={['operations']} />}>
        <Route path="/operations" element={<OpsProvider><AppShell /></OpsProvider>}>
        <Route index element={<OpsDashboard />} />
        <Route path="map" element={<OperationsMap />} />
        <Route path="incidents" element={<IncidentCenter />} />
        <Route path="incidents/:id" element={<IncidentCenter />} />
        <Route path="environmental" element={<EnvironmentalMonitoring />} />
        <Route path="forecast" element={<ForecastWorkspace />} />
        <Route path="alerts" element={<AlertsWorkspace />} />
        <Route path="playback" element={<SkeletonDashboard title="Playback" />} />
        <Route path="resources" element={<ResponseResources />} />
        <Route path="reports" element={<SkeletonDashboard title="Reports" />} />
        <Route path="compliance" element={<ComplianceWorkspace />} />
        <Route path="settings" element={<OpsSettingsWorkspace />} />
        </Route>
      </Route>

      {/* Government Platform */}
      <Route element={<ProtectedRoute allowedPlatforms={['government']} />}>
        <Route path="/government" element={<GovProvider><AppShell /></GovProvider>}>
          <Route index element={<ExecutiveDashboard />} />
        <Route path="communication" element={<CitizenCommunication />} />
        <Route path="reports" element={<GovReports />} />
        <Route path="compliance" element={<GovCompliance />} />
        <Route path="projects" element={<ProjectsPlanning />} />
        <Route path="settings" element={<GovSettings />} />
        </Route>
      </Route>
      
      <Route path="*" element={<div className="p-8 text-center">404 Not Found</div>} />
    </Routes>
  );
}
