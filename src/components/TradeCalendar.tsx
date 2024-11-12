import React, { useState } from 'react';
import { Trade } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

interface TradeCalendarProps {
  trades: Trade[];
}

interface DayStats {
  profit: number;
  trades: number;
  winRate: number;
  bestTrade: number;
  worstTrade: number;
}

export function TradeCalendar({ trades }: TradeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDailyResults = () => {
    const results: { [key: string]: DayStats } = {};
    
    trades.forEach(trade => {
      const date = trade.date.split('T')[0];
      if (!results[date]) {
        results[date] = {
          profit: 0,
          trades: 0,
          winRate: 0,
          bestTrade: -Infinity,
          worstTrade: Infinity,
        };
      }
      results[date].profit += trade.profit;
      results[date].trades += 1;
      results[date].bestTrade = Math.max(results[date].bestTrade, trade.profit);
      results[date].worstTrade = Math.min(results[date].worstTrade, trade.profit);
    });

    // Calculate win rate
    Object.keys(results).forEach(date => {
      const dayTrades = trades.filter(t => t.date.split('T')[0] === date);
      const winningTrades = dayTrades.filter(t => t.profit > 0).length;
      results[date].winRate = (winningTrades / dayTrades.length) * 100;
    });

    return results;
  };

  const getMonthStats = () => {
    const monthTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getMonth() === currentDate.getMonth() &&
             tradeDate.getFullYear() === currentDate.getFullYear();
    });

    const totalProfit = monthTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const tradingDays = new Set(monthTrades.map(t => t.date.split('T')[0])).size;
    const winningTrades = monthTrades.filter(t => t.profit > 0).length;
    const winRate = (winningTrades / monthTrades.length) * 100 || 0;

    return {
      totalProfit,
      tradingDays,
      totalTrades: monthTrades.length,
      winRate,
    };
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const dailyResults = getDailyResults();
  const monthStats = getMonthStats();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

  const getBackgroundColor = (profit: number) => {
    if (profit === 0) return 'bg-gray-800';
    const intensity = Math.min(Math.abs(profit) / 1000 * 100, 100);
    return profit > 0
      ? `bg-green-${Math.round(intensity / 10) * 100}/20`
      : `bg-red-${Math.round(intensity / 10) * 100}/20`;
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-gray-300 font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );

  const renderDay = (dayNumber: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)
      .toISOString()
      .split('T')[0];
    const result = dailyResults[date];
    const isSelected = selectedDate === date;

    if (!result) {
      return (
        <div className={`h-24 p-2 rounded-lg transition-colors ${
          isSelected ? 'ring-2 ring-purple-500' : ''
        }`}>
          <span className="text-gray-500">{dayNumber}</span>
        </div>
      );
    }

    const profitClass = result.profit >= 0 ? 'text-green-400' : 'text-red-400';
    const bgClass = getBackgroundColor(result.profit);

    return (
      <button
        onClick={() => setSelectedDate(isSelected ? null : date)}
        className={`h-24 p-2 w-full rounded-lg ${bgClass} hover:bg-gray-700/50 transition-colors relative group ${
          isSelected ? 'ring-2 ring-purple-500' : ''
        }`}
      >
        <span className="text-gray-300">{dayNumber}</span>
        <div className="mt-1">
          <p className={`text-sm font-medium ${profitClass}`}>
            {formatCurrency(result.profit)}
          </p>
          <p className="text-xs text-gray-400">
            {result.trades} trade{result.trades !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-blue-400">
            {result.winRate.toFixed(0)}% win
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lucro do Mês"
          value={formatCurrency(monthStats.totalProfit)}
          icon={DollarSign}
          colorClass="bg-green-500/20 text-green-500"
        />
        <StatCard
          title="Dias Operados"
          value={monthStats.tradingDays}
          icon={CalendarIcon}
          colorClass="bg-purple-500/20 text-purple-500"
        />
        <StatCard
          title="Total de Trades"
          value={monthStats.totalTrades}
          icon={BarChart2}
          colorClass="bg-blue-500/20 text-blue-500"
        />
        <StatCard
          title="Taxa de Acerto"
          value={`${monthStats.winRate.toFixed(1)}%`}
          icon={TrendingUp}
          colorClass="bg-yellow-500/20 text-yellow-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Calendário de Trades</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-lg text-white capitalize">
              {monthName} {currentDate.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-700 rounded-lg overflow-hidden">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div
              key={day}
              className="text-center py-2 text-sm font-medium text-gray-400 bg-gray-800"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-700 mt-px rounded-lg overflow-hidden">
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-800"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div key={index + 1} className="bg-gray-800">
              {renderDay(index + 1)}
            </div>
          ))}
        </div>

        {selectedDate && dailyResults[selectedDate] && (
          <div className="mt-6 bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detalhes do dia {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-600 rounded-lg p-3">
                <p className="text-sm text-gray-400">Lucro Total</p>
                <p className={`text-lg font-medium ${
                  dailyResults[selectedDate].profit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(dailyResults[selectedDate].profit)}
                </p>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <p className="text-sm text-gray-400">Trades</p>
                <p className="text-lg font-medium text-white">
                  {dailyResults[selectedDate].trades}
                </p>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <p className="text-sm text-gray-400">Melhor Trade</p>
                <p className="text-lg font-medium text-green-400">
                  {formatCurrency(dailyResults[selectedDate].bestTrade)}
                </p>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <p className="text-sm text-gray-400">Pior Trade</p>
                <p className="text-lg font-medium text-red-400">
                  {formatCurrency(dailyResults[selectedDate].worstTrade)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}