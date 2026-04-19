import React, { useState } from 'react';
import { 
  Plus, 
  History, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Trash2,
  X,
  Target,
  Download,
  Upload,
  Calendar,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { useBankroll } from './hooks/useBankroll';
import { formatCurrency, formatDate, cn } from './utils';

// --- Site Form Component ---
const SiteForm = ({ onAdd, onClose }: { onAdd: (name: string, balance: number) => void, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isNaN(Number(balance))) return;
    onAdd(name, Number(balance));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="card w-full max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Adicionar Site</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
            <X size={24} />
          </button>
        </div>
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
      </div>
    </div>
  );
};

// --- Session Form Component ---
const SessionForm = ({ 
  sites, 
  onRegister, 
  onUpdateBalance,
  onClose 
}: { 
  sites: any[], 
  onRegister: (siteId: string, hands: number, balance: number, timestamp: number) => void, 
  onUpdateBalance: (siteId: string, balance: number) => void,
  onClose: () => void 
}) => {
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [hands, setHands] = useState('');
  const [balance, setBalance] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEditingInitial, setIsEditingInitial] = useState(false);
  const [newInitialBalance, setNewInitialBalance] = useState('');

  const currentSite = sites.find(s => s.id === siteId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId || isNaN(Number(hands)) || isNaN(Number(balance))) return;
    
    // Convert local date to timestamp
    const selectedDate = new Date(date);
    // Adjust for timezone if needed, but simple Date(date) usually works for noon to avoid day shifts
    selectedDate.setHours(12, 0, 0, 0); 
    
    onRegister(siteId, Number(hands), Number(balance), selectedDate.getTime());
    onClose();
  };

  const handleUpdateInitial = () => {
    if (isNaN(Number(newInitialBalance))) return;
    onUpdateBalance(siteId, Number(newInitialBalance));
    setIsEditingInitial(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="card w-full max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Registrar Sessão</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
            <X size={24} />
          </button>
        </div>
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
                  onClick={handleUpdateInitial}
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

          {/* Real-time Preview */}
          {balance && (
            <div className={cn(
              "p-4 rounded-2xl flex justify-between items-center",
              (Number(balance) - (currentSite?.balance || 0)) >= 0 
                ? "bg-success/10 text-success" 
                : "bg-danger/10 text-danger"
            )}>
              <span className="text-sm font-bold uppercase tracking-wider">Resultado:</span>
              <span className="text-lg font-black">
                {(Number(balance) - (currentSite?.balance || 0)) >= 0 ? '+' : ''}
                {formatCurrency(Number(balance) - (currentSite?.balance || 0))}
              </span>
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-2">
            Confirmar Sessão
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Edit Session Form ---
const EditSessionForm = ({ 
  session, 
  onUpdate, 
  onClose 
}: { 
  session: any, 
  onUpdate: (id: string, hands: number, balance: number, timestamp: number) => void, 
  onClose: () => void 
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="card w-full max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editar Sessão</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
            <X size={24} />
          </button>
        </div>
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
      </div>
    </div>
  );
};

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
  } = useBankroll();
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const itemsPerPage = 10;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importData(content);
      // Reset input
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-32 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 via-primary to-cyan-400 bg-clip-text text-transparent tracking-tight">
          Stack<span className="text-white">Flow</span>
        </h1>
        <div className="flex gap-1">
          <button 
            onClick={exportData}
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
              onChange={handleImport}
            />
          </label>
          <button 
            onClick={resetData}
            className="p-2 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
            title="Resetar Dados"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-zinc-800 to-zinc-900 border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} />
          </div>
          <p className="text-zinc-400 font-medium mb-1 flex items-center gap-2">
            <Wallet size={16} /> Banca Total
          </p>
          <h2 className={cn(
            "text-4xl font-black tracking-tight",
            stats.totalBankroll >= 0 ? "text-white" : "text-danger"
          )}>
            {formatCurrency(stats.totalBankroll)}
          </h2>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Lucro Geral</p>
              <p className={cn(
                "text-lg font-bold flex items-center gap-1",
                stats.totalProfit >= 0 ? "text-success" : "text-danger"
              )}>
                {stats.totalProfit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {formatCurrency(stats.totalProfit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Total Mãos</p>
              <p className="text-lg font-bold text-zinc-200 flex items-center gap-1">
                <Target size={16} className="text-primary" />
                {stats.totalHands.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-bold flex items-center gap-2">
             <Layers size={18} className="text-primary" />
             Sites de Poker
          </h3>
          <button 
            onClick={() => setShowSiteForm(true)}
            className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
        
        <div className="space-y-3">
          {sites.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600">
              Nenhum site cadastrado ainda.
            </div>
          ) : (
            sites.map(site => (
              <div key={site.id} className="card py-3 px-4 flex justify-between items-center bg-zinc-900/50 group">
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-100">{site.name}</span>
                  <span className="font-mono text-zinc-400 text-sm">{formatCurrency(site.balance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const amount = prompt(`Quanto deseja sacar de ${site.name}?`, site.balance.toString());
                      if (amount && !isNaN(Number(amount))) {
                        registerCashout(site.id, Number(amount));
                      }
                    }}
                    className="p-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
                    title="Sacar Saldo"
                  >
                    <Download size={14} className="rotate-180" /> Sacar
                  </button>
                  <button 
                    onClick={() => deleteSite(site.id)}
                    className="p-2 text-zinc-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover Site"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-4 px-1">
          <History size={18} className="text-primary" />
          <h3 className="text-lg font-bold">Histórico Recente</h3>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6 px-1">
          <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
            <button 
              onClick={() => setSelectedSites([])}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                selectedSites.length === 0 
                  ? "bg-primary border-primary text-white" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
              )}
            >
              Todos
            </button>
            {sites.map(site => (
              <button 
                key={site.id}
                onClick={() => {
                  if (selectedSites.includes(site.id)) {
                    setSelectedSites(prev => prev.filter(id => id !== site.id));
                  } else {
                    setSelectedSites(prev => [...prev, site.id]);
                  }
                }}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                  selectedSites.includes(site.id)
                    ? "bg-zinc-800 border-zinc-700 text-zinc-200" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                )}
              >
                {site.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-zinc-500" />
            <select 
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-zinc-400 cursor-pointer focus:outline-none"
            >
              <option value="date_desc" className="bg-zinc-900">Data (Mais Novo)</option>
              <option value="date_asc" className="bg-zinc-900">Data (Mais Antigo)</option>
              <option value="profit_desc" className="bg-zinc-900">Maior Lucro</option>
              <option value="profit_asc" className="bg-zinc-900">Menor Lucro (ou Prejuízo)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600">
               Registre sua primeira sessão para ver o histórico.
            </div>
          ) : (
            (() => {
              const filteredSessions = sessions.filter(s => 
                selectedSites.length === 0 || selectedSites.includes(s.siteId)
              );

              const sortedSessions = [...filteredSessions].sort((a, b) => {
                if (sortBy === 'date_desc') return b.timestamp - a.timestamp;
                if (sortBy === 'date_asc') return a.timestamp - b.timestamp;
                if (sortBy === 'profit_desc') return b.profit - a.profit;
                if (sortBy === 'profit_asc') return a.profit - b.profit;
                return 0;
              });

              const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
              const currentSessions = sortedSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
              
              return (
                <>
                  <div className="space-y-3">
                    {currentSessions.map(session => (
                      <div key={session.id} className="card p-4 bg-zinc-900/30 group relative">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-zinc-100">{session.siteName}</p>
                            <p className="text-[10px] text-zinc-500 uppercase font-black">{formatDate(session.timestamp)}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {session.type !== 'cashout' && (
                                <button 
                                  onClick={() => setEditingSession(session)}
                                  className="p-1.5 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="Editar Sessão"
                                >
                                  <Pencil size={14} />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteSession(session.id)}
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
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                              currentPage === page 
                                ? "bg-primary text-white" 
                                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            )}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              );
            })()
          )}
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto flex gap-4 pointer-events-auto">
          {sites.length > 0 && (
            <button 
              onClick={() => setShowSessionForm(true)}
              className="btn-primary flex-1 shadow-2xl shadow-primary/20"
            >
              Registrar Sessão
            </button>
          )}
          {sites.length === 0 && (
            <button 
              onClick={() => setShowSiteForm(true)}
              className="btn-primary flex-1 shadow-2xl shadow-primary/20"
            >
              Adicionar Site
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSiteForm && <SiteForm onAdd={addSite} onClose={() => setShowSiteForm(false)} />}
      {showSessionForm && (
        <SessionForm 
          sites={sites} 
          onRegister={registerSession} 
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
