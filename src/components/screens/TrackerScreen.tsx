import React from 'react';
import { PhilippineMapTracker } from '../PhilippineMapTracker';
import { useNews } from '../../context/NewsContext';
import { Activity, ShieldAlert, Plus, Radio, AlertTriangle } from 'lucide-react';

export const TrackerScreen: React.FC = () => {
  const { setIsCmsOpen, disasterItems } = useNews();

  const activeHazardsCount = disasterItems.filter(
    d => d.currentStatus === 'ALERT' || d.currentStatus === 'DEVELOPING'
  ).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Activity className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-display font-black text-2xl text-white">
                PHILIPPINES DISASTER TRACKER
              </h2>
              <p className="text-xs text-neutral-400">
                Archipelago Hazard Monitoring, Radar Telemetry & Public Safety Advisories
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeHazardsCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-red-600/30 text-red-400 border border-red-500 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              {activeHazardsCount} Elevated Hazard{activeHazardsCount > 1 ? 's' : ''}
            </span>
          )}

          <button
            onClick={() => setIsCmsOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Update Hazards in CMS</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Hazard Cards Component */}
      <PhilippineMapTracker />

      {/* Safety Protocol Quick Reference */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h4 className="font-display font-black text-sm uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          Standard Philippine Disaster Preparedness Protocols (NDRRMC)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-300">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <h5 className="font-bold text-red-400">Tropical Cyclone & Floods</h5>
            <p className="text-neutral-400">Charge powerbanks, prepare 72-hour survival Go-Bags, elevate electrical appliances, heed pre-emptive evacuation warnings before river stage peaks.</p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <h5 className="font-bold text-amber-400">Volcanic Unrest</h5>
            <p className="text-neutral-400">Respect the Permanent Danger Zone (PDZ), wear moist cloth or N95 masks during sulfur venting/ashfall, protect drinking water reservoirs from tephra.</p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <h5 className="font-bold text-blue-400">Earthquake Response</h5>
            <p className="text-neutral-400">Execute Duck, Cover, and Hold during ground shaking. Avoid glass and masonry facades. Inspect building integrity prior to re-entry.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
