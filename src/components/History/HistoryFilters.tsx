import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { PokerSite } from '../../types/index';
import { cn } from '../../utils';

interface HistoryFiltersProps {
  sites: PokerSite[];
  selectedSites: string[];
  onSelectSites: (sites: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  sites,
  selectedSites,
  onSelectSites,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6 px-1">
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
          Todos
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
              "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
              selectedSites.includes(site.id)
                ? "bg-zinc-800 border-zinc-700 text-zinc-200" 
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
            )}
          >
            {site.name}
          </button>
        ))}
      </div>
      
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
          <option value="profit_asc" className="bg-zinc-900">Menor Lucro (ou Prejuízo)</option>
        </select>
      </div>
    </div>
  );
};
