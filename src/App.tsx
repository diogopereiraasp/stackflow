import React, { useState, useMemo } from 'react';
import { Layers, History } from 'lucide-react';
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
  const itemsPerPage = 10;

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
    const filtered = sessions.filter(s => 
      selectedSites.length === 0 || selectedSites.includes(s.siteId)
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'date_desc') return b.timestamp - a.timestamp;
      if (sortBy === 'date_asc') return a.timestamp - b.timestamp;
      if (sortBy === 'profit_desc') return b.profit - a.profit;
      if (sortBy === 'profit_asc') return a.profit - b.profit;
      return 0;
    });
  }, [sessions, selectedSites, sortBy]);

  const totalPages = Math.ceil(processedSessions.length / itemsPerPage);
  const currentSessions = processedSessions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-32 min-h-screen">
      <Header 
        onExport={exportData} 
        onImport={handleImport} 
        onReset={resetData} 
      />

      <BankrollStats {...stats} />

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
        />

        <div className="space-y-3">
          {processedSessions.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600">
               Nenhum registro encontrado.
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
