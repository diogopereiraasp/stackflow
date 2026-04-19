import React, { useState } from 'react';
import { Modal } from '../UI/Modal';

interface SiteFormProps {
  onAdd: (name: string, balance: number) => void;
  onClose: () => void;
}

export const SiteForm: React.FC<SiteFormProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isNaN(Number(balance))) return;
    onAdd(name, Number(balance));
    onClose();
  };

  return (
    <Modal title="Adicionar Site" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nome do Site</label>
          <input 
            autoFocus
            className="input-field" 
            placeholder="Ex: PokerStars" 
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Saldo Inicial (R$)</label>
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
        <button type="submit" className="btn-primary w-full mt-4">
          Salvar Site
        </button>
      </form>
    </Modal>
  );
};
