import React, { useState, useMemo, useEffect } from 'react';
import { Layers, History } from 'lucide-react';
import { startOfDay, startOfMonth, subDays } from 'date-fns';
import { useBankrollStore } from './store/BankrollContext';
import { Header } from './components/Header';
import { BankrollStats } from './components/BankrollStats';
import { SiteItem } from './components/Sites/SiteItem';
import { SiteForm } from './components/Sites/SiteForm';
import { SessionForm } from './components/Sessions/SessionForm';
import { EditSessionForm } from './components/Sessions/EditSessionForm';
import { HistoryItem } from './components/History/HistoryItem';
import { HistoryFilters } from './components/History/HistoryFilters';
import { Pagination } from './components/History/Pagination';
import type { Session } from './types/index';

export default function App() {
  const { 
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
    stats 
  } = useBankrollStore();

  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  
  // History State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month' | 'custom'>('day');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [stake, setStake] = useState(() => localStorage.getItem('poker_stake') || '20');
  const itemsPerPage = 10;

  useEffect(() => {
    localStorage.setItem('poker_stake', stake);
  }, [stake]);

  const siteProfits = useMemo(() => {
    return sites.reduce((acc, site) => {
      acc[site.id] = sessions
        .filter(s => s.siteId === site.id && s.type !== 'cashout')
        .reduce((sum, s) => sum + s.profit, 0);
      return acc;
    }, {} as Record<string, number>);
  }, [sites, sessions]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => importData(event.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  // Logic for filtered and sorted sessions
  const processedSessions = useMemo(() => {
    const now = new Date();
    
    const filtered = sessions.filter(s => {
      const siteMatch = selectedSites.length === 0 || selectedSites.includes(s.siteId);
      
      let timeMatch = true;
      if (timeFilter === 'day') {
        timeMatch = s.timestamp >= startOfDay(now).getTime();
      } else if (timeFilter === 'week') {
        timeMatch = s.timestamp >= subDays(now, 7).getTime();
      } else if (timeFilter === 'month') {
        timeMatch = s.timestamp >= startOfMonth(now).getTime();
      } else if (timeFilter === 'custom') {
        const start = customRange.start ? startOfDay(new Date(customRange.start)).getTime() : 0;
        const end = customRange.end ? new Date(new Date(customRange.end).setHours(23, 59, 59, 999)).getTime() : Infinity;
        timeMatch = s.timestamp >= start && s.timestamp <= end;
      }

      return siteMatch && timeMatch;
    });

    console.log(`[DEBUG] Sessões totais: ${sessions.length}, Filtradas: ${filtered.length}`);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'date_desc') {
        return (b.timestamp - a.timestamp) || b.id.localeCompare(a.id);
      }
      if (sortBy === 'date_asc') {
        return (a.timestamp - b.timestamp) || a.id.localeCompare(b.id);
      }
      if (sortBy === 'profit_desc') return b.profit - a.profit;
      if (sortBy === 'profit_asc') return a.profit - b.profit;
      return 0;
    });
  }, [sessions, selectedSites, sortBy, timeFilter, customRange]);

  const totalPages = Math.ceil(processedSessions.length / itemsPerPage);
  const currentSessions = processedSessions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const periodStats = useMemo(() => {
    return processedSessions.reduce((acc, s) => {
      if (s.type !== 'cashout') {
        acc.profit += s.profit;
        acc.hands += s.hands;
      }
      return acc;
    }, { profit: 0, hands: 0 });
  }, [processedSessions]);

  const bb100 = useMemo(() => {
    if (stats.totalHands === 0) return 0;
    const bbValue = parseFloat(stake) / 100;
    if (isNaN(bbValue) || bbValue === 0) return 0;
    return (stats.totalProfit / bbValue) / (stats.totalHands / 100);
  }, [stats.totalProfit, stats.totalHands, stake]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-32 min-h-screen">
      <Header 
        onExport={exportData} 
        onImport={handleImport} 
        onReset={resetData} 
        stake={stake}
        onStakeChange={setStake}
        bb100={bb100}
      />

      <BankrollStats {...stats} bb100={bb100} />

      {/* Sites Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-bold flex items-center gap-2">
             <Layers size={18} className="text-primary" />
             Sites de Poker
          </h3>
          <button 
            onClick={() => setShowSiteForm(true)}
            className="text-sm font-bold text-primary hover:underline"
          >
            + Adicionar
          </button>
        </div>
        
        <div className="space-y-3">
          {sites.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600">
              Nenhum site cadastrado ainda.
            </div>
          ) : (
            sites.map(site => (
              <SiteItem 
                key={site.id} 
                site={site} 
                profit={siteProfits[site.id] || 0}
                onCashout={registerCashout} 
                onDelete={deleteSite} 
              />
            ))
          )}
        </div>
      </section>

      {/* History Section */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-4 px-1">
          <History size={18} className="text-primary" />
          <h3 className="text-lg font-bold">Histórico Recente</h3>
        </div>

        <HistoryFilters 
          sites={sites}
          selectedSites={selectedSites}
          onSelectSites={(s) => { setSelectedSites(s); setCurrentPage(1); }}
          sortBy={sortBy}
          onSortChange={(s) => { setSortBy(s); setCurrentPage(1); }}
          timeFilter={timeFilter}
          onTimeFilterChange={(f) => { setTimeFilter(f); setCurrentPage(1); }}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          periodStats={periodStats}
        />

        <div className="space-y-3">
          {processedSessions.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-center">
               <p className="text-zinc-600 mb-2">Nenhum registro encontrado.</p>
               {sessions.length > 0 && (
                 <button 
                   onClick={() => { setSelectedSites([]); setSortBy('date_desc'); }}
                   className="text-xs font-bold text-primary hover:underline"
                 >
                   Limpar todos os filtros
                 </button>
               )}
            </div>
          ) : (
            <>
              {currentSessions.map(session => (
                <HistoryItem 
                  key={session.id} 
                  session={session} 
                  onEdit={setEditingSession} 
                  onDelete={deleteSession} 
                />
              ))}
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}
        </div>
      </section>

      {/* Floating Action/Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto flex gap-4 pointer-events-auto">
          <button 
            onClick={() => sites.length > 0 ? setShowSessionForm(true) : setShowSiteForm(true)}
            className="btn-primary flex-1 shadow-2xl shadow-primary/20"
          >
            {sites.length > 0 ? 'Registrar Sessão' : 'Adicionar Site'}
          </button>
        </div>
      </div>

      {/* Modals */}
      {showSiteForm && (
        <SiteForm onAdd={addSite} onClose={() => setShowSiteForm(false)} />
      )}
      {showSessionForm && (
        <SessionForm 
          sites={sites} 
          onRegister={(...args) => {
            registerSession(...args);
            setSelectedSites([]);
            setCurrentPage(1);
          }} 
          onUpdateBalance={updateSiteBalance}
          onClose={() => setShowSessionForm(false)} 
        />
      )}
      {editingSession && (
        <EditSessionForm 
          session={editingSession}
          onUpdate={updateSession}
          onClose={() => setEditingSession(null)}
        />
      )}
    </div>
  );
}
