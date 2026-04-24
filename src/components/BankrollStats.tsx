import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, Gauge } from 'lucide-react';
import { formatCurrency, cn } from '../utils';

interface StatsProps {
  totalBankroll: number;
  totalProfit: number;
  totalHands: number;
  bb100: number;
}

export const BankrollStats: React.FC<StatsProps> = ({ 
  totalBankroll, totalProfit, totalHands, bb100 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      <div className="card bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800/40 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity text-white rotate-12">
          <Wallet size={200} />
        </div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <Wallet size={12} className="text-primary/70" /> Banca Total
          </p>
          <h2 className={cn(
            "text-4xl sm:text-5xl font-black tracking-tighter mb-6",
            totalBankroll >= 0 ? "text-white" : "text-danger"
          )}>
            {formatCurrency(totalBankroll)}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-800/50">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Lucro Geral</p>
              <p className={cn(
                "text-lg font-black flex items-center gap-1.5",
                totalProfit >= 0 ? "text-success" : "text-danger"
              )}>
                {totalProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {formatCurrency(totalProfit)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Winrate</p>
              <p className={cn(
                "text-lg font-black flex items-center gap-1.5",
                bb100 >= 0 ? "text-green-400" : "text-red-400"
              )}>
                <Gauge size={14} className="opacity-70" />
                {bb100.toFixed(2)} <span className="text-[10px] opacity-40 font-bold">bb</span>
              </p>
            </div>
            
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Mãos</p>
              <p className="text-lg font-black text-zinc-200 flex items-center gap-1.5">
                <Target size={14} className="text-primary/70" />
                {totalHands.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
