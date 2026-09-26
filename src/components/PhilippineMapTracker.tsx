import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { DisasterItem, HazardType, HazardSeverity } from '../types';
import { 
  AlertCircle, 
  Flame, 
  Wind, 
  Activity, 
  Waves, 
  Mountain, 
  ShieldAlert, 
  ExternalLink, 
  Calendar, 
  MapPin,
  Globe,
  Layers,
  Sparkles,
  Radio
} from 'lucide-react';
import { getStatusBadgeClass } from './CrisisWatchBanner';
import { Philippine3DMapTracker } from './Philippine3DMapTracker';

export const getHazardIcon = (type: HazardType, className = 'w-4 h-4') => {
  switch (type) {
    case 'Typhoon':
      return <Wind className={`${className} text-sky-400`} />;
    case 'Volcanic Activity':
      return <Flame className={`${className} text-amber-500`} />;
    case 'Earthquake':
      return <Activity className={`${className} text-rose-500`} />;
    case 'Flooding':
      return <Waves className={`${className} text-blue-400`} />;
    case 'Landslide':
      return <Mountain className={`${className} text-yellow-600`} />;
    default:
      return <AlertCircle className={`${className} text-orange-400`} />;
  }
};

export const getSeverityBadge = (severity: HazardSeverity) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-700 text-white font-black';
    case 'Severe':
      return 'bg-red-600 text-white font-bold';
    case 'High':
      return 'bg-amber-600 text-neutral-950 font-bold';
    case 'Moderate':
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40';
    case 'Low':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    default:
      return 'bg-neutral-800 text-neutral-300';
  }
};

export interface PhilippineMapTrackerProps {
  initialMode?: '2d' | '3d';
}

export const PhilippineMapTracker: React.FC<PhilippineMapTrackerProps> = ({ initialMode = '2d' }) => {
  const { disasterItems, selectedHazard, setSelectedHazard, setIsCmsOpen } = useNews();
  const [mapMode, setMapMode] = useState<'2d' | '3d'>(initialMode);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterRegion, setFilterRegion] = useState<string>('All');

  const filteredItems = disasterItems.filter(item => {
    const matchType = filterType === 'All' || item.hazardType === filterType;
    const matchRegion = filterRegion === 'All' || item.region === filterRegion;
    return matchType && matchRegion;
  });

  // Normalize lat/lng to SVG coordinates for Philippines bounds
  // Lat: approx 4.5°N to 21.5°N (range: 17)
  // Lng: approx 116°E to 127°E (range: 11)
  const mapCoordsToSvg = (lat: number, lng: number) => {
    const minLat = 4.5;
    const maxLat = 21.5;
    const minLng = 116.0;
    const maxLng = 127.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 360 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 520 + 20;
    return { x, y };
  };

  return (
    <div className="space-y-5">
      {/* 2 OPTIONS SELECTOR & FILTERS BAR */}
      <div className="space-y-3">
        {/* Top Primary 2-Option Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 glass-panel rounded-2xl shadow-2xl border border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 shrink-0">
              Map View Mode:
            </span>
            <div className="inline-flex p-1 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setMapMode('2d')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                  mapMode === '2d'
                    ? 'yellow-gradient-btn shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Normal 2D Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setMapMode('3d')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                  mapMode === '3d'
                    ? 'yellow-gradient-btn shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${mapMode === '3d' ? 'text-neutral-950' : 'text-cyan-400'}`} />
                <span>3D Spatial Globe</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  mapMode === '3d' ? 'bg-neutral-950/20 text-neutral-950' : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  3D WebGL
                </span>
              </button>
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            <span>
              {mapMode === '2d'
                ? 'Option 1: Tactical SVG Coastline & PAR Radar Coordinates'
                : 'Option 2: Three.js 3D Globe with Dynamic Cyclonic Vortex & Beacons'}
            </span>
          </div>
        </div>

        {/* Hazard Category & Regional Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel-subtle rounded-xl text-xs border border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
              Hazard:
            </span>
            {['All', 'Typhoon', 'Volcanic Activity', 'Earthquake', 'Flooding'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  filterType === type
                    ? 'yellow-gradient-btn shadow-md'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400 uppercase tracking-wider">
              Region:
            </span>
            <select
              value={filterRegion}
              onChange={e => setFilterRegion(e.target.value)}
              className="bg-neutral-900 text-neutral-200 border border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Regions</option>
              <option value="Luzon">Luzon</option>
              <option value="Visayas">Visayas</option>
              <option value="Mindanao">Mindanao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Archipelago Map & Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map Container (Either Normal 2D SVG or 3D Spatial Globe) */}
        <div className="lg:col-span-5 space-y-2">
          {mapMode === '2d' ? (
            /* Option 1: Normal 2D Radar View */
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-display font-black text-sm uppercase tracking-wider text-amber-400">
                      2D Nautical Radar Map
                    </h3>
                  </div>
                  <p className="text-[11px] text-neutral-400">Click a marker to inspect telemetry & advisory</p>
                </div>
                <button
                  onClick={() => setMapMode('3d')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700 flex items-center gap-1 transition-colors"
                  title="Switch to 3D View"
                >
                  <Globe className="w-3 h-3" />
                  <span>Switch to 3D</span>
                </button>
              </div>

              <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl border border-neutral-800/80 p-2 flex items-center justify-center">
                {/* SVG archipelago silhouette and pins */}
                <svg
                  viewBox="0 0 400 560"
                  className="w-full h-full max-h-[500px] select-none"
                >
                  {/* Philippine Area of Responsibility (PAR) dotted boundaries */}
                  <rect x="15" y="15" width="370" height="530" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="25" y="35" fill="#64748b" fontSize="10" fontFamily="monospace">PAR BOUNDARY</text>
                  <text x="285" y="535" fill="#64748b" fontSize="9" fontFamily="monospace">PHILIPPINE SEA</text>
                  <text x="25" y="320" fill="#64748b" fontSize="9" fontFamily="monospace">WEST PH SEA</text>
                  <text x="50" y="470" fill="#64748b" fontSize="9" fontFamily="monospace">SULU SEA</text>

                  {/* Stylized Island Outlines */}
                  <g fill="#262626" stroke="#404040" strokeWidth="1.2">
                    {/* Batanes & Babuyan */}
                    <ellipse cx="215" cy="55" rx="8" ry="4" fill="#3f3f46" />
                    <ellipse cx="212" cy="75" rx="12" ry="5" fill="#3f3f46" />

                    {/* Northern & Central Luzon */}
                    <path d="M 180 95 L 235 100 L 250 160 L 230 215 L 180 210 L 165 150 Z" fill="#2d2d2d" />
                    <path d="M 180 210 L 225 215 L 245 270 L 205 275 L 175 240 Z" fill="#2d2d2d" />
                    {/* Bicol Peninsula */}
                    <path d="M 235 245 Q 260 260 280 295 L 265 315 L 235 270 Z" fill="#2d2d2d" />

                    {/* Mindoro & Palawan */}
                    <ellipse cx="165" cy="275" rx="16" ry="24" transform="rotate(-25 165 275)" fill="#2d2d2d" />
                    <path d="M 80 340 L 135 285 L 145 295 L 90 355 Z" fill="#2d2d2d" />

                    {/* Visayas */}
                    <ellipse cx="190" cy="335" rx="14" ry="16" fill="#2d2d2d" />
                    <path d="M 205 330 L 218 375 L 210 380 L 198 340 Z" fill="#2d2d2d" />
                    <path d="M 228 335 L 236 375 L 230 380 L 222 340 Z" fill="#2d2d2d" />
                    <path d="M 270 310 L 285 335 L 265 380 L 250 340 Z" fill="#2d2d2d" />

                    {/* Mindanao */}
                    <path d="M 190 420 L 285 410 L 310 470 L 265 520 L 210 500 L 180 460 Z" fill="#2d2d2d" />
                    <path d="M 160 450 L 195 440 L 190 475 L 150 465 Z" fill="#2d2d2d" />
                  </g>

                  {/* Map Pins for all filtered hazard items */}
                  {filteredItems.map(item => {
                    const { x, y } = mapCoordsToSvg(item.coordinates.lat, item.coordinates.lng);
                    const isSelected = selectedHazard?.id === item.id;

                    return (
                      <g
                        key={item.id}
                        className="cursor-pointer group"
                        onClick={() => setSelectedHazard(item)}
                      >
                        {/* Pulsing ring for Alert/Developing items */}
                        {(item.currentStatus === 'ALERT' || item.currentStatus === 'DEVELOPING') && (
                          <circle
                            cx={x}
                            cy={y}
                            r="16"
                            fill="none"
                            stroke={item.currentStatus === 'ALERT' ? '#ef4444' : '#f59e0b'}
                            strokeWidth="1.5"
                            opacity="0.7"
                            className="animate-ping"
                          />
                        )}

                        {/* Marker circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? '10' : '8'}
                          fill={
                            isSelected 
                              ? '#f59e0b' 
                              : item.currentStatus === 'ALERT' 
                                ? '#dc2626' 
                                : item.currentStatus === 'MONITORING' 
                                  ? '#2563eb' 
                                  : '#10b981'
                          }
                          stroke="#ffffff"
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          className="transition-transform group-hover:scale-125"
                        />

                        {/* Label */}
                        <text
                          x={x + 12}
                          y={y + 4}
                          fill="#f3f4f6"
                          fontSize="9"
                          fontWeight="bold"
                          className="drop-shadow-md select-none pointer-events-none"
                        >
                          {item.eventName.length > 20 ? item.eventName.slice(0, 18) + '...' : item.eventName}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Quick legend on the map corner */}
                <div className="absolute bottom-3 left-3 bg-neutral-950/90 border border-neutral-800 rounded-lg p-2 text-[10px] text-neutral-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    <span>ALERT / Severe</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span>MONITORING</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>RESOLVED</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Option 2: 3D Spatial Globe View */
            <div className="space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-neutral-200">
                    3D Spatial Archipelago View
                  </span>
                </div>
                <button
                  onClick={() => setMapMode('2d')}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 flex items-center gap-1 transition-colors"
                  title="Switch to 2D View"
                >
                  <Layers className="w-3 h-3" />
                  <span>Switch to 2D Normal Map</span>
                </button>
              </div>

              <Philippine3DMapTracker />
            </div>
          )}
        </div>

        {/* Right: Hazard Cards List & Selected Hazard Focus */}
        <div className="lg:col-span-7 space-y-4">
          {/* If a hazard is selected, show focused banner */}
          {selectedHazard && (
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.22)] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {getHazardIcon(selectedHazard.hazardType, 'w-5 h-5')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${getStatusBadgeClass(selectedHazard.currentStatus)}`}>
                        {selectedHazard.currentStatus}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${getSeverityBadge(selectedHazard.severity)}`}>
                        {selectedHazard.severity} Severity
                      </span>
                      {selectedHazard.bulletinNo && (
                        <span className="text-[11px] font-mono text-neutral-400">
                          {selectedHazard.bulletinNo}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-black text-lg text-white mt-1">
                      {selectedHazard.eventName}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHazard(null)}
                  className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 active:scale-95 transition-all"
                >
                  Close Focus
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 bg-white/[0.04] p-3 rounded-xl border border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span><strong>Location:</strong> {selectedHazard.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Reported:</strong> {selectedHazard.dateTime}</span>
                </div>
              </div>

              <p className="text-sm text-neutral-200 leading-relaxed">
                {selectedHazard.description}
              </p>

              {/* Public Advisories list */}
              {selectedHazard.advisories && selectedHazard.advisories.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Active Directives & Advisories:
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {selectedHazard.advisories.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold shrink-0">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-white/[0.06]">
                <span>Verified Source: <strong className="text-neutral-200">{selectedHazard.source}</strong></span>
                {selectedHazard.sourceUrl && (
                  <a
                    href={selectedHazard.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* List of all hazards */}
          <div className="flex items-center justify-between">
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-neutral-200">
              Active Hazard Reports ({filteredItems.length})
            </h4>
            <button
              onClick={() => setIsCmsOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              + Add / Edit Hazard in CMS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredItems.map(item => {
              const isSelected = selectedHazard?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedHazard(item)}
                  className={`p-4 rounded-xl transition-all cursor-pointer ${
                    isSelected 
                      ? 'glass-panel border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50' 
                      : 'glass-card-interactive'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-neutral-200">
                      {getHazardIcon(item.hazardType, 'w-4 h-4')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(item.currentStatus)}`}>
                      {item.currentStatus}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-neutral-100 line-clamp-1 mb-1 group-hover:text-amber-300 transition-colors">
                    {item.eventName}
                  </h4>

                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-white/[0.06]">
                    <span className="truncate max-w-[140px]">📍 {item.location}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${getSeverityBadge(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
