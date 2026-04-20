import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils';
import type { PokerSite } from '../../types/index';

interface SiteItemProps {
  site: PokerSite;
  onCashout: (siteId: string, amount: number) => void;
  onDelete: (siteId: string) => void;
}

export const SiteItem: React.FC<SiteItemProps> = ({ site, onCashout, onDelete }) => {
  return (
    <div className="card py-3 px-4 flex justify-between items-center bg-zinc-900/50 group">
      <div className="flex flex-col">
        <span className="font-bold text-zinc-100">{site.name}</span>
        <span className="font-mono text-zinc-400 text-sm">{formatCurrency(site.balance)}</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => {
            const amount = prompt(`Quanto deseja sacar de ${site.name}?`, site.balance.toString());
            if (amount && !isNaN(Number(amount))) {
              onCashout(site.id, Number(amount));
            }
          }}
          className="p-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
          title="Sacar Saldo"
        >
          <Download size={14} className="rotate-180" /> Sacar
        </button>
        <button 
          onClick={() => onDelete(site.id)}
          className="p-2 text-zinc-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          title="Remover Site"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
