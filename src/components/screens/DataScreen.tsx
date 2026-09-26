import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { TrendingUp, BarChart2, Table, Plus, Info, Calendar, Database } from 'lucide-react';
import { DataMetric } from '../../types';

export const DataScreen: React.FC = () => {
  const { dataMetrics, setIsCmsOpen } = useNews();
  const [selectedMetricId, setSelectedMetricId] = useState<string>(dataMetrics[0]?.id || '');
  const [viewFormat, setViewFormat] = useState<'chart' | 'table'>('chart');

  const activeMetric = dataMetrics.find(m => m.id === selectedMetricId) || dataMetrics[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-display font-black text-2xl text-white">
                DATA INSIGHTS
              </h2>
              <p className="text-xs text-neutral-400">
                Data Journalism, Philippine Demographics, Economic Trajectories & Public Metrics
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCmsOpen(true)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Edit Datasets in CMS</span>
        </button>
      </div>

      {/* Dataset Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {dataMetrics.map(metric => (
          <button
            key={metric.id}
            onClick={() => setSelectedMetricId(metric.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedMetricId === metric.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{metric.category}: {metric.headlineValue}</span>
          </button>
        ))}
      </div>

      {/* Main Focus Data Card */}
      {activeMetric && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                {activeMetric.category} Dataset
              </span>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-neutral-100">
                {activeMetric.title}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-neutral-950 px-4 py-2 rounded-xl border border-neutral-800 text-right">
                <div className="font-mono font-black text-2xl sm:text-3xl text-purple-400">
                  {activeMetric.headlineValue}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {activeMetric.headlineUnit}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  onClick={() => setViewFormat('chart')}
                  className={`p-2 rounded-lg transition-colors ${viewFormat === 'chart' ? 'bg-purple-600 text-white' : 'text-neutral-400'}`}
                  title="Chart View"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewFormat('table')}
                  className={`p-2 rounded-lg transition-colors ${viewFormat === 'table' ? 'bg-purple-600 text-white' : 'text-neutral-400'}`}
                  title="Data Table View"
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Narrative Summary */}
          <p className="font-serif text-sm sm:text-base text-neutral-200 leading-relaxed bg-neutral-950/70 p-4 rounded-xl border border-neutral-800/80">
            {activeMetric.summary}
          </p>

          {/* Chart or Table Rendering */}
          {viewFormat === 'chart' ? (
            <div className="p-4 sm:p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-bold text-neutral-300">Visual Distribution</span>
                <span className="text-emerald-400 font-mono font-semibold">{activeMetric.trendText}</span>
              </div>

              {/* Responsive SVG Chart */}
              {activeMetric.chartType === 'line' ? (
                <div className="h-64 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-4 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-1/4 border-b border-neutral-800/50"></div>
                  <div className="absolute inset-x-0 top-2/4 border-b border-neutral-800/50"></div>
                  <div className="absolute inset-x-0 top-3/4 border-b border-neutral-800/50"></div>

                  {activeMetric.chartData.map((pt, i) => {
                    const maxVal = Math.max(...activeMetric.chartData.map(d => d.value)) * 1.2;
                    const heightPct = (pt.value / maxVal) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                        <span className="text-[11px] font-mono font-bold text-purple-300 group-hover:scale-110 transition-transform">
                          {pt.value}%
                        </span>
                        <div
                          className="w-full max-w-[40px] bg-gradient-to-t from-purple-800 to-purple-500 rounded-t group-hover:from-purple-600 group-hover:to-purple-400 transition-colors shadow-lg"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-xs font-mono text-neutral-400">{pt.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : activeMetric.chartType === 'donut' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {activeMetric.chartData.map((pt, i) => (
                    <div key={i} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
                      <div className="text-3xl font-mono font-black text-purple-400">{pt.formatted || `${pt.value}%`}</div>
                      <div className="text-xs font-bold text-neutral-200">{pt.label}</div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pt.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Bar Chart */
                <div className="space-y-3 pt-2">
                  {activeMetric.chartData.map((pt, i) => {
                    const maxVal = Math.max(...activeMetric.chartData.map(d => d.value));
                    const widthPct = (pt.value / maxVal) * 100;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-300">
                          <span className="font-medium">{pt.label}</span>
                          <span className="font-mono font-bold text-purple-400">{pt.formatted || pt.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-neutral-900 h-4 rounded-full overflow-hidden border border-neutral-800">
                          <div
                            className="bg-gradient-to-r from-purple-700 to-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-mono border-b border-neutral-800">
                  <tr>
                    <th className="p-3">Variable / Category</th>
                    <th className="p-3 text-right">Reported Value</th>
                    <th className="p-3 text-right">Formatted Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {activeMetric.chartData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-950/50">
                      <td className="p-3 font-medium text-neutral-200">{row.label}</td>
                      <td className="p-3 font-mono text-right text-purple-400">{row.value}</td>
                      <td className="p-3 font-mono text-right text-neutral-400">{row.formatted || row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Source, Date Updated & Methodology Required Info */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Dataset Provenance & Methodology</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-neutral-800 text-neutral-400">
              <div>
                <strong className="text-neutral-200">SOURCE:</strong> {activeMetric.source}
              </div>
              <div>
                <strong className="text-neutral-200">DATE UPDATED:</strong> {activeMetric.dateUpdated}
              </div>
            </div>

            <div className="text-neutral-400 pt-1 border-t border-neutral-800/80">
              <strong className="text-neutral-200">METHODOLOGY/NOTES:</strong> {activeMetric.methodology}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
