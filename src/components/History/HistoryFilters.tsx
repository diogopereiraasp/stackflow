import React from 'react';
import { ArrowUpDown, Calendar, TrendingUp, Hash } from 'lucide-react';
import type { PokerSite } from '../../types/index';
import { cn } from '../../utils';
import { formatCurrency } from '../../utils/formatters';

interface HistoryFiltersProps {
  sites: PokerSite[];
  selectedSites: string[];
  onSelectSites: (sites: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  timeFilter: 'all' | 'day' | 'week' | 'month' | 'custom';
  onTimeFilterChange: (filter: 'all' | 'day' | 'week' | 'month' | 'custom') => void;
  customRange: { start: string; end: string };
  onCustomRangeChange: (range: { start: string; end: string }) => void;
  periodStats: { profit: number; hands: number };
  periodBb100: number;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  sites,
  selectedSites,
  onSelectSites,
  sortBy,
  onSortChange,
  timeFilter,
  onTimeFilterChange,
  customRange,
  onCustomRangeChange,
  periodStats,
  periodBb100,
}) => {
  const timeOptions = [
    { id: 'day', label: 'Hoje' },
    { id: 'week', label: '7 Dias' },
    { id: 'month', label: 'Mês' },
    { id: 'all', label: 'Tudo' },
    { id: 'custom', label: 'Custom' },
  ] as const;

  return (
    <div className="flex flex-col gap-4 mb-6 px-1">
      {/* Period Summary Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Resultado no Período</p>
          <div className="flex items-baseline gap-2">
            <h4 className={cn(
              "text-xl font-black tabular-nums",
              periodStats.profit >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {formatCurrency(periodStats.profit)}
            </h4>
            {periodStats.profit !== 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                periodStats.profit >= 0 ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
              )}>
                {periodStats.profit >= 0 ? '↑' : '↓'}
              </span>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Winrate</p>
          <div className={cn(
            "text-lg font-black tabular-nums",
            periodBb100 >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {periodBb100.toFixed(1)} <span className="text-[10px] font-bold opacity-50">bb/100</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Volume</p>
          <div className="flex items-center gap-1.5 justify-end text-zinc-300 font-bold">
            <Hash size={12} className="text-primary" />
            <span className="tabular-nums">{periodStats.hands.toLocaleString()} <span className="text-[10px] text-zinc-500">mãos</span></span>
          </div>
        </div>
      </div>

      {/* Time Filters */}
      <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/50 gap-1">
        {timeOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onTimeFilterChange(option.id)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
              timeFilter === option.id
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      {timeFilter === 'custom' && (
        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 ml-1">DE</label>
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="date"
                value={customRange.start}
                onChange={e => onCustomRangeChange({ ...customRange, start: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-8 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 ml-1">ATÉ</label>
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="date"
                value={customRange.end}
                onChange={e => onCustomRangeChange({ ...customRange, end: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-8 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      )}

      <div className="h-px bg-zinc-800/50 my-1" />

      {/* Site Filters */}
      <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
        <button 
          onClick={() => onSelectSites([])}
          className={cn(
            "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
            selectedSites.length === 0 
              ? "bg-primary border-primary text-white" 
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
          )}
        >
          Todos os Sites
        </button>
        {sites.map(site => (
          <button 
            key={site.id}
            onClick={() => {
              if (selectedSites.includes(site.id)) {
                onSelectSites(selectedSites.filter(id => id !== site.id));
              } else {
                onSelectSites([...selectedSites, site.id]);
              }
            }}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2",
              selectedSites.includes(site.id)
                ? "bg-zinc-800 border-zinc-700 text-zinc-200" 
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
            )}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            {site.name}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-zinc-500" />
          <select 
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-zinc-400 cursor-pointer focus:outline-none"
          >
            <option value="date_desc" className="bg-zinc-900">Data (Mais Novo)</option>
            <option value="date_asc" className="bg-zinc-900">Data (Mais Antigo)</option>
            <option value="profit_desc" className="bg-zinc-900">Maior Lucro</option>
            <option value="profit_asc" className="bg-zinc-900">Menor Lucro</option>
          </select>
        </div>

        {selectedSites.length > 0 && (
          <button 
            onClick={() => onSelectSites([])}
            className="text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors"
          >
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};
