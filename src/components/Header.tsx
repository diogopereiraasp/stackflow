import React from 'react';
import { Download, Upload, Trash2, Gauge } from 'lucide-react';
import { cn } from '../utils';

interface HeaderProps {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  stake: string;
  onStakeChange: (stake: string) => void;
  bb100: number;
  totalHands: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onExport, onImport, onReset, stake, onStakeChange, bb100, totalHands 
}) => {
  return (
    <header className="flex justify-between items-center mb-8 gap-4">
      <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 via-primary to-cyan-400 bg-clip-text text-transparent tracking-tight shrink-0">
        Stack<span className="text-white">Flow</span>
      </h1>

      <div className="flex items-center gap-6 flex-1 justify-end mr-6">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 text-center w-full">Stake</span>
          <div className="flex items-center text-xs font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg">
            <span className="text-primary mr-0.5">NL</span>
            <input 
              type="number"
              value={stake}
              onChange={(e) => onStakeChange(e.target.value)}
              className="w-8 bg-transparent focus:outline-none text-zinc-200"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Winrate</span>
          <div className={cn(
            "text-base font-black tabular-nums flex items-center gap-1",
            bb100 >= 0 ? "text-green-400" : "text-red-400"
          )}>
            <Gauge size={12} className="opacity-70" />
            {bb100.toFixed(1)} <span className="text-[9px] font-bold opacity-50">bb/100</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Mãos</span>
          <div className="text-base font-black text-zinc-200 flex items-center gap-1">
            <span className="text-primary opacity-70">#</span>
            {totalHands.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 shrink-0">
        <button 
          onClick={onExport}
          className="p-2 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
          title="Exportar Dados (Backup)"
        >
          <Download size={20} />
        </button>
        <label className="p-2 text-zinc-500 hover:text-success hover:bg-success/10 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center">
          <Upload size={20} />
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={onImport}
          />
        </label>
        <button 
          onClick={onReset}
          className="p-2 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
          title="Resetar Dados"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
};
