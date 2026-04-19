import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Modal } from '../UI/Modal';
import type { Session } from '../../types/index';

interface EditSessionFormProps {
  session: Session;
  onUpdate: (id: string, hands: number, balance: number, timestamp: number) => void;
  onClose: () => void;
}

export const EditSessionForm: React.FC<EditSessionFormProps> = ({ 
  session, 
  onUpdate, 
  onClose 
}) => {
  const [hands, setHands] = useState(session.hands.toString());
  const [balance, setBalance] = useState(session.newBalance.toString());
  const [date, setDate] = useState(new Date(session.timestamp).toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(Number(hands)) || isNaN(Number(balance))) return;
    
    const selectedDate = new Date(date);
    selectedDate.setHours(12, 0, 0, 0);
    
    onUpdate(session.id, Number(hands), Number(balance), selectedDate.getTime());
    onClose();
  };

  return (
    <Modal title="Editar Sessão" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-zinc-500 mb-2">Site: <strong className="text-zinc-300">{session.siteName}</strong></p>
        
        <div>
          <label className="label">Data</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="date" 
              className="input-field pl-12" 
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Mãos Jogadas</label>
            <input 
              type="number" 
              className="input-field" 
              value={hands}
              onChange={e => setHands(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Saldo Final</label>
            <input 
              type="number" 
              step="0.01" 
              className="input-field" 
              value={balance}
              onChange={e => setBalance(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-2">
          Salvar Alterações
        </button>
      </form>
    </Modal>
  );
};
