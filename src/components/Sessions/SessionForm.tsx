import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils';
import type { PokerSite } from '../../types/index';

interface SessionFormProps {
  sites: PokerSite[];
  onRegister: (siteId: string, hands: number, balance: number, timestamp: number) => void;
  onUpdateBalance: (siteId: string, balance: number) => void;
  onClose: () => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({ 
  sites, 
  onRegister, 
  onUpdateBalance,
  onClose 
}) => {
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [hands, setHands] = useState('');
  const [balance, setBalance] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [isEditingInitial, setIsEditingInitial] = useState(false);
  const [newInitialBalance, setNewInitialBalance] = useState('');

  const currentSite = sites.find(s => s.id === siteId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId || isNaN(Number(hands)) || isNaN(Number(balance))) return;
    
    const selectedDate = new Date(date);
    selectedDate.setHours(12, 0, 0, 0); 
    
    onRegister(siteId, Number(hands), Number(balance), selectedDate.getTime());
    onClose();
  };

  return (
    <Modal title="Registrar Sessão" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Site</label>
          <select 
            className="input-field appearance-none cursor-pointer"
            value={siteId}
            onChange={e => setSiteId(e.target.value)}
            required
          >
            {sites.map(s => (
              <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>
            ))}
          </select>

          <div className="flex justify-between items-center mt-2 ml-1">
            <p className="text-xs text-zinc-500">
              Saldo atual: <strong>{formatCurrency(currentSite?.balance || 0)}</strong>
            </p>
            <button 
              type="button"
              onClick={() => {
                setIsEditingInitial(true);
                setNewInitialBalance(currentSite?.balance.toString() || '');
              }}
              className="text-[10px] font-bold text-primary uppercase hover:underline"
            >
              Editar Saldo Inicial
            </button>
          </div>

          {isEditingInitial && (
            <div className="mt-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700 flex gap-2">
              <input 
                type="number"
                step="0.01"
                className="input-field py-2 text-sm"
                placeholder="Novo saldo inicial"
                value={newInitialBalance}
                onChange={e => setNewInitialBalance(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => {
                  if (!isNaN(Number(newInitialBalance))) {
                    onUpdateBalance(siteId, Number(newInitialBalance));
                    setIsEditingInitial(false);
                  }
                }}
                className="bg-primary text-white px-4 rounded-xl text-xs font-bold"
              >
                OK
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="label">Data da Sessão</label>
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
              placeholder="0"
              value={hands}
              onChange={e => setHands(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Saldo Final (Total)</label>
            <input 
              type="number" 
              step="0.01" 
              className="input-field" 
              placeholder="0,00"
              value={balance}
              onChange={e => setBalance(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-2">
          Confirmar Sessão
        </button>
      </form>
    </Modal>
  );
};
