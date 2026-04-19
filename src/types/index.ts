export interface PokerSite {
  id: string;
  name: string;
  balance: number;
}

export interface Session {
  id: string;
  siteId: string;
  siteName: string;
  hands: number;
  oldBalance: number;
  newBalance: number;
  profit: number;
  timestamp: number;
  type?: 'session' | 'cashout';
}

export interface BankrollData {
  sites: PokerSite[];
  sessions: Session[];
}
