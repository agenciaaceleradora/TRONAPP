export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface Trade {
  id: string;
  date: string;
  pair: string;
  entryPrice: number;
  exitPrice: number;
  lots: number;
  profit: number;
  type: 'BUY' | 'SELL';
}

export interface TradeFormData {
  date: string;
  pair: string;
  entryPrice: string | number;
  exitPrice: string | number;
  lots: string | number;
  type: 'BUY' | 'SELL';
  profit?: number;
}

export interface TradeFilters {
  dateRange: {
    start: string;
    end: string;
  };
  pair: string;
  type: 'ALL' | 'BUY' | 'SELL';
  profitRange: {
    min: string;
    max: string;
  };
  onlyProfitable: boolean;
}