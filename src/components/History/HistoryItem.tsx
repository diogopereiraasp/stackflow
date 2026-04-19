import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Session } from '../../types/index';
import { formatCurrency, formatDate, cn } from '../../utils';

interface HistoryItemProps {
  session: Session;
  onEdit: (session: Session) => void;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, onEdit, onDelete }) => {
  return (
    <div className="card p-4 bg-zinc-900/30 group relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-zinc-100">{session.siteName}</p>
          <p className="text-[10px] text-zinc-500 uppercase font-black">{formatDate(session.timestamp)}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {session.type !== 'cashout' && (
              <button 
                onClick={() => onEdit(session)}
                className="p-1.5 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Editar Sessão"
              >
                <Pencil size={14} />
              </button>
            )}
            <button 
              onClick={() => onDelete(session.id)}
              className="p-1.5 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              title="Excluir Sessão"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-black shrink-0",
            session.type === 'cashout' 
              ? "bg-zinc-800 text-zinc-400"
              : session.profit >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}>
            {session.type === 'cashout' ? 'SAQUE' : (session.profit >= 0 ? '+' : '') + formatCurrency(session.profit)}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-zinc-400">
        <span>{session.type === 'cashout' ? 'Retirada de fundos' : `${session.hands.toLocaleString()} mãos`}</span>
        <div className="flex items-center gap-2">
           <span className="opacity-50 line-through">{formatCurrency(session.oldBalance)}</span>
           <span className="text-zinc-200">→ {formatCurrency(session.newBalance)}</span>
        </div>
      </div>
    </div>
  );
};
