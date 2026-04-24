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
    <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5 sm:gap-0">
      <div className="flex items-center justify-between w-full sm:w-auto px-1 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-primary to-cyan-400 bg-clip-text text-transparent tracking-tighter shrink-0">
            Stack<span className="text-white">Flow</span>
          </h1>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] -mt-1 hidden sm:block">Bankroll Tracker</span>
        </div>
        
        {/* Mobile Actions - Grouped in a subtle pill */}
        <div className="flex sm:hidden items-center bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-0.5 shadow-lg shadow-black/20">
          <HeaderActions onExport={onExport} onImport={onImport} onReset={onReset} />
        </div>
      </div>

      {/* Stats Bar - More premium glass look on mobile */}
      <div className="flex items-center justify-between sm:justify-end gap-0 sm:gap-6 flex-1 sm:mr-6 w-full sm:w-auto bg-zinc-900/40 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none rounded-2xl border border-zinc-800/50 sm:border-0 overflow-hidden shadow-xl shadow-black/10">
        <div className="flex-1 flex flex-col items-center py-2.5 sm:py-0 border-r border-zinc-800/50 sm:border-0">
          <span className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">Stake</span>
          <div className="flex items-center text-[11px] sm:text-xs font-black bg-zinc-800/50 sm:bg-zinc-900 border border-zinc-700/30 sm:border-zinc-800 px-2 py-0.5 rounded-lg shadow-inner text-zinc-100">
            <span className="text-primary mr-0.5 opacity-80">NL</span>
            <input 
              type="number"
              value={stake}
              onChange={(e) => onStakeChange(e.target.value)}
              className="w-10 bg-transparent focus:outline-none text-center"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center py-2.5 sm:py-0 border-r border-zinc-800/50 sm:border-0">
          <span className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">Winrate</span>
          <div className={cn(
            "text-xs sm:text-base font-black tabular-nums flex items-center gap-1",
            bb100 >= 0 ? "text-green-400" : "text-red-400"
          )}>
            <Gauge size={10} className="opacity-50" />
            {bb100.toFixed(1)}<span className="text-[8px] font-bold opacity-40 ml-0.5">bb</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center py-2.5 sm:py-0">
          <span className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">Mãos</span>
          <div className="text-xs sm:text-base font-black text-zinc-100 flex items-center gap-1">
            <span className="text-primary opacity-50">#</span>
            {totalHands >= 10000 
              ? `${(totalHands / 1000).toFixed(1)}k` 
              : totalHands.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Desktop Actions */}
      <div className="hidden sm:flex gap-1 shrink-0">
        <HeaderActions onExport={onExport} onImport={onImport} onReset={onReset} />
      </div>
    </header>
  );
};

interface HeaderActionsProps {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onExport, onImport, onReset }) => (
  <>
    <button 
      onClick={onExport}
      className="p-1.5 sm:p-2 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
      title="Exportar Dados (Backup)"
    >
      <Download size={18} />
    </button>
    <label className="p-1.5 sm:p-2 text-zinc-500 hover:text-success hover:bg-success/10 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center">
      <Upload size={18} />
      <input 
        type="file" 
        accept=".json" 
        className="hidden" 
        onChange={onImport}
      />
    </label>
    <button 
      onClick={onReset}
      className="p-1.5 sm:p-2 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
      title="Resetar Dados"
    >
      <Trash2 size={18} />
    </button>
  </>
);
