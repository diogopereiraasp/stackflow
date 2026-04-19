import React from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onImport, onReset }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 via-primary to-cyan-400 bg-clip-text text-transparent tracking-tight">
        Stack<span className="text-white">Flow</span>
      </h1>
      <div className="flex gap-1">
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
