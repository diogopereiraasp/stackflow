import React, { createContext, useContext, ReactNode } from 'react';
import { useBankroll } from '../hooks/useBankroll';

type BankrollContextType = ReturnType<typeof useBankroll>;

const BankrollContext = createContext<BankrollContextType | undefined>(undefined);

export const BankrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bankroll = useBankroll();
  return (
    <BankrollContext.Provider value={bankroll}>
      {children}
    </BankrollContext.Provider>
  );
};

export const useBankrollStore = () => {
  const context = useContext(BankrollContext);
  if (!context) {
    throw new Error('useBankrollStore must be used within a BankrollProvider');
  }
  return context;
};
