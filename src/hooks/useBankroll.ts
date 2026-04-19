import { useState, useEffect, useMemo } from 'react';
import type { PokerSite, Session } from '../types';

const STORAGE_KEY = 'poker_bankroll_data';

export const useBankroll = () => {
  const [sites, setSites] = useState<PokerSite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).sites : [];
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).sessions : [];
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sites, sessions }));
  }, [sites, sessions]);

  const addSite = (name: string, initialBalance: number) => {
    const newSite: PokerSite = {
      id: crypto.randomUUID(),
      name,
      balance: initialBalance,
    };
    setSites(prev => [...prev, newSite]);
  };

  const registerSession = (siteId: string, hands: number, newBalance: number, timestamp = Date.now()) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;

    const profit = newBalance - site.balance;
    const session: Session = {
      id: crypto.randomUUID(),
      siteId,
      siteName: site.name,
      hands,
      oldBalance: site.balance,
      newBalance,
      profit,
      timestamp,
      type: 'session',
    };

    setSessions(prev => [session, ...prev]);
    setSites(prev => 
      prev.map(s => s.id === siteId ? { ...s, balance: newBalance } : s)
    );
  };

  const registerCashout = (siteId: string, amount: number, timestamp = Date.now()) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;

    if (amount > site.balance) {
      alert("Saldo insuficiente para realizar este saque!");
      return;
    }

    const session: Session = {
      id: crypto.randomUUID(),
      siteId,
      siteName: site.name,
      hands: 0,
      oldBalance: site.balance,
      newBalance: site.balance - amount,
      profit: 0,
      timestamp,
      type: 'cashout',
    };

    setSessions(prev => [session, ...prev]);
    setSites(prev => 
      prev.map(s => s.id === siteId ? { ...s, balance: s.balance - amount } : s)
    );
  };

  const updateSession = (sessionId: string, hands: number, newBalance: number, timestamp: number) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const site = sites.find(s => s.id === session.siteId);
    
    // Update the session
    const updatedSessions = sessions.map(s => {
      if (s.id === sessionId) {
        const profit = newBalance - s.oldBalance;
        return { ...s, hands, newBalance, profit, timestamp };
      }
      return s;
    });

    setSessions(updatedSessions);

    // If it's the most recent session for this site, update the site balance
    // Actually, it's safer to recalculate the site balance based on all sessions if we want it perfect
    // But for simplicity, we update the current site balance IF the session we edited was the current state.
    // However, usually bankroll trackers handle this by letting user fix balance.
    // Let's check if the edited session is the latest for that site.
    const siteSessions = updatedSessions.filter(s => s.siteId === session.siteId).sort((a, b) => b.timestamp - a.timestamp);
    if (siteSessions.length > 0 && siteSessions[0].id === sessionId && site) {
      setSites(prev => prev.map(s => s.id === site.id ? { ...s, balance: newBalance } : s));
    }
  };


  const deleteSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;
    
    if (confirm(`Deseja remover o site "${site.name}"? O saldo atual será removido da banca total, mas o histórico de sessões será mantido.`)) {
      setSites(prev => prev.filter(s => s.id !== siteId));
    }
  };

  const updateSiteBalance = (siteId: string, newBalance: number) => {
    setSites(prev => 
      prev.map(s => s.id === siteId ? { ...s, balance: newBalance } : s)
    );
  };

  const deleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (confirm('Deseja excluir esta sessão? O saldo do site voltará ao valor anterior.')) {
      // Revert site balance
      setSites(prev => 
        prev.map(s => s.id === session.siteId ? { ...s, balance: session.oldBalance } : s)
      );
      // Remove session
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  const exportData = () => {
    const data = { sites, sessions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stackflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.sites && data.sessions) {
        if (confirm('Isso irá substituir todos os dados atuais. Deseja continuar?')) {
          setSites(data.sites);
          setSessions(data.sessions);
          return true;
        }
      } else {
        alert('Formato de arquivo inválido.');
      }
    } catch (e) {
      alert('Erro ao ler o arquivo.');
    }
    return false;
  };

  const resetData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      setSites([]);
      setSessions([]);
    }
  };

  const stats = useMemo(() => {
    const totalBankroll = sites.reduce((acc, site) => acc + site.balance, 0);
    const totalProfit = sessions.reduce((acc, session) => acc + (session.type === 'cashout' ? 0 : session.profit), 0);
    const totalHands = sessions.reduce((acc, session) => acc + session.hands, 0);
    
    return {
      totalBankroll,
      totalProfit,
      totalHands,
    };
  }, [sites, sessions]);

  return {
    sites,
    sessions,
    addSite,
    registerSession,
    registerCashout,
    updateSession,
    updateSiteBalance,
    deleteSession,
    deleteSite,
    exportData,
    importData,
    resetData,
    stats,
  };
};
