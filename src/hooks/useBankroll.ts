import { useState, useEffect, useMemo } from 'react';
import type { PokerSite, Session } from '../types/index';

const STORAGE_KEY = 'poker_bankroll_data';

export const useBankroll = () => {
  const [sites, setSites] = useState<PokerSite[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).sites || [] : [];
    } catch (e) {
      console.error("[StackFlow] Erro ao ler sites do localStorage:", e);
      return [];
    }
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).sessions || [] : [];
    } catch (e) {
      console.error("[StackFlow] Erro ao ler sessões do localStorage:", e);
      return [];
    }
  });

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
    if (!site) {
      console.error("[StackFlow] Erro: Site não encontrado para o registro.", { siteId, sites });
      alert("Erro ao encontrar o site selecionado.");
      return;
    }

    const session: Session = {
      id: crypto.randomUUID(),
      siteId,
      siteName: site.name,
      hands,
      oldBalance: site.balance,
      newBalance,
      profit: newBalance - site.balance,
      timestamp,
      type: 'session',
    };

    console.log("[StackFlow] Registrando Sessão:", session);

    setSessions(prev => [session, ...prev]);
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, balance: newBalance } : s));
  };

  const registerCashout = (siteId: string, amount: number, timestamp = Date.now()) => {
    const site = sites.find(s => s.id === siteId);
    if (!site || amount > site.balance) return;

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
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, balance: s.balance - amount } : s));
  };

  const updateSession = (sessionId: string, hands: number, newBalance: number, timestamp: number) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const updatedSessions = sessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, hands, newBalance, profit: newBalance - s.oldBalance, timestamp };
      }
      return s;
    });

    setSessions(updatedSessions);

    // Update site balance if this was the latest session
    const siteSessions = [...updatedSessions]
      .filter(s => s.siteId === session.siteId)
      .sort((a, b) => b.timestamp - a.timestamp);
      
    if (siteSessions.length > 0 && siteSessions[0].id === sessionId) {
      setSites(prev => prev.map(s => s.id === session.siteId ? { ...s, balance: newBalance } : s));
    }
  };

  const deleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session || !confirm('Excluir esta sessão e reverter o saldo?')) return;

    setSites(prev => prev.map(s => s.id === session.siteId ? { ...s, balance: session.oldBalance } : s));
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const deleteSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (!site || !confirm(`Remover "${site.name}"? (O histórico será mantido)`)) return;
    setSites(prev => prev.filter(s => s.id !== siteId));
  };

  const updateSiteBalance = (siteId: string, balance: number) => {
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, balance } : s));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ sites, sessions }, null, 2)], { type: 'application/json' });
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
      if (data.sites && data.sessions && confirm('Substituir todos os dados atuais?')) {
        setSites(data.sites);
        setSessions(data.sessions);
      }
    } catch (e) { alert('Erro ao importar arquivo.'); }
  };

  const resetData = () => {
    if (confirm('Apagar tudo definitivamente?')) {
      setSites([]);
      setSessions([]);
    }
  };

  const stats = useMemo(() => ({
    totalBankroll: sites.reduce((acc, s) => acc + s.balance, 0),
    totalProfit: sessions.reduce((acc, s) => acc + (s.type === 'cashout' ? 0 : s.profit), 0),
    totalHands: sessions.reduce((acc, s) => acc + s.hands, 0),
  }), [sites, sessions]);

  return {
    sites, sessions, stats,
    addSite, registerSession, registerCashout, updateSession,
    updateSiteBalance, deleteSession, deleteSite,
    exportData, importData, resetData,
  };
};
