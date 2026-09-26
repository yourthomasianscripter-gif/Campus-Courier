import React from 'react';
import { useNews } from '../../context/NewsContext';
import { ShieldCheck, ExternalLink, Database, BookOpen, AlertTriangle, FileText } from 'lucide-react';

export const SourcesScreen: React.FC = () => {
  const { articles, disasterItems, dataMetrics } = useNews();

  const institutionalSources = [
    {
      agency: 'DOST-PAGASA',
      fullName: 'Philippine Atmospheric, Geophysical and Astronomical Services Administration',
      role: 'Official National Weather Bureau, Tropical Cyclone Bulletins & Storm Warnings',
      url: 'https://bagong.pagasa.dost.gov.ph',
      usedIn: 'Crisis Watch, Weather Reports, Disaster Tracker',
    },
    {
      agency: 'DOST-PHIVOLCS',
      fullName: 'Philippine Institute of Volcanology and Seismology',
      role: 'Volcano Alert Levels (Kanlaon, Mayon, Taal), Seismic Earthquake Logs & Tsunami Warnings',
      url: 'https://www.phivolcs.dost.gov.ph',
      usedIn: 'Disaster Tracker, Volcanology Reports',
    },
    {
      agency: 'NDRRMC',
      fullName: 'National Disaster Risk Reduction and Management Council',
      role: 'National Civil Defense & Disaster Coordination Operations Center',
      url: 'https://ndrrmc.gov.ph',
      usedIn: 'Emergency Hotlines, Evacuation Directives',
    },
    {
      agency: 'Department of Health (DOH) & RITM',
      fullName: 'Department of Health & Research Institute for Tropical Medicine',
      role: 'Epidemiological Bulletins, Genomic Sequencing, Vector-Borne Disease Advisories',
      url: 'https://doh.gov.ph',
      usedIn: 'Science & Health Reporting, Dengue Surveillance',
    },
    {
      agency: 'Philippine Space Agency (PhilSA)',
      fullName: 'Philippine Space Agency',
      role: 'Earth Observation Microsatellite Telemetry, Multispectral Vegetation Indices',
      url: 'https://philsa.gov.ph',
      usedIn: 'Science & Agriculture Technology',
    },
    {
      agency: 'Philippine Statistics Authority (PSA)',
      fullName: 'Philippine Statistics Authority',
      role: 'Consumer Price Index (CPI), National Headline Inflation & Census Demographics',
      url: 'https://psa.gov.ph',
      usedIn: 'Data Insights, Economic Indicators',
    },
    {
      agency: 'Commission on Higher Education (CHED)',
      fullName: 'Commission on Higher Education',
      role: 'State Universities & Colleges (SUCs) Enrollment Records & SUC Research Grants',
      url: 'https://ched.gov.ph',
      usedIn: 'National News, Higher Education Desk',
    },
    {
      agency: 'National Historical Commission of the Philippines (NHCP)',
      fullName: 'National Historical Commission of the Philippines',
      role: 'Jose Rizal Ghent 1891 Manuscripts, GOMBURZA 1872 Records & Historiography',
      url: 'https://nhcp.gov.ph',
      usedIn: 'Historical Point — El Filibusterismo',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="font-display font-black text-2xl text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          SOURCE TRANSPARENCY & VERIFICATION DIRECTORY
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Complete index of official government agencies, scientific repositories, and editorial standards
        </p>
      </div>

      {/* Editorial Taxonomy Standards */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-display font-black text-base text-amber-300">
          Editorial Taxonomy: Content Distinctions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600/20 text-red-400 font-bold">
              NEWS
            </span>
            <p className="text-neutral-300 font-medium">Fact-based, time-sensitive accounts grounded in official press bulletins, verified witness reporting, and eyewitness disaster coverage.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600/20 text-blue-400 font-bold">
              ANALYSIS
            </span>
            <p className="text-neutral-300 font-medium">In-depth contextual breakdown by academic fellows, synthesizing historical data, statutes, and systemic patterns.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-600/20 text-purple-400 font-bold">
              OPINION
            </span>
            <p className="text-neutral-300 font-medium">Perspectives and moral arguments of signed columnists. Clearly isolated from news gathering to protect reader objectivity.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-600/20 text-amber-400 font-bold">
              EDUCATIONAL
            </span>
            <p className="text-neutral-300 font-medium">Curricular and historical guides on Philippine literature (e.g. Rizal's *El Filibusterismo*), validated against primary historical records.</p>
          </div>
        </div>
      </div>

      {/* Verified Institutional Sources List */}
      <div className="space-y-4">
        <h3 className="font-display font-black text-base text-neutral-200">
          Official Institutional Reference Partners
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institutionalSources.map((src, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm">{src.agency}</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-xs"
                >
                  Visit Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h4 className="font-bold text-neutral-100 text-sm">
                {src.fullName}
              </h4>

              <p className="text-xs text-neutral-300">
                {src.role}
              </p>

              <div className="pt-2 text-[11px] text-neutral-400 border-t border-neutral-800">
                <strong>Utilized In:</strong> {src.usedIn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
