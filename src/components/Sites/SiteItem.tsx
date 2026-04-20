import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils';
import type { PokerSite } from '../../types/index';

interface SiteItemProps {
  site: PokerSite;
  profit: number;
  onCashout: (siteId: string, amount: number) => void;
  onDelete: (siteId: string) => void;
}

export const SiteItem: React.FC<SiteItemProps> = ({ site, profit, onCashout, onDelete }) => {
  return (
    <div className="card py-3 px-4 flex justify-between items-center bg-zinc-900/50 group">
      <div className="flex flex-col">
        <span className="font-bold text-zinc-100">{site.name}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400 text-sm">{formatCurrency(site.balance)}</span>
          <span className={profit >= 0 ? "text-[10px] font-black text-success" : "text-[10px] font-black text-danger"}>
             ({profit >= 0 ? '+' : ''}{formatCurrency(profit)})
          </span>
        </div>
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
