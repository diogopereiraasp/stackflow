import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { formatCurrency, cn } from '../utils';

interface StatsProps {
  totalBankroll: number;
  totalProfit: number;
  totalHands: number;
}

export const BankrollStats: React.FC<StatsProps> = ({ totalBankroll, totalProfit, totalHands }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      <div className="card bg-gradient-to-br from-zinc-800 to-zinc-900 border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet size={80} />
        </div>
        <p className="text-zinc-400 font-medium mb-1 flex items-center gap-2">
          <Wallet size={16} /> Banca Total
        </p>
        <h2 className={cn(
          "text-4xl font-black tracking-tight",
          totalBankroll >= 0 ? "text-white" : "text-danger"
        )}>
          {formatCurrency(totalBankroll)}
        </h2>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Lucro Geral</p>
            <p className={cn(
              "text-lg font-bold flex items-center gap-1",
              totalProfit >= 0 ? "text-success" : "text-danger"
            )}>
              {totalProfit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {formatCurrency(totalProfit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Total Mãos</p>
            <p className="text-lg font-bold text-zinc-200 flex items-center gap-1">
              <Target size={16} className="text-primary" />
              {totalHands.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
