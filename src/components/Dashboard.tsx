import React, { useState, useEffect } from 'react';
import { Trade } from '../types';
import { fetchUserData } from '../firestoreFunctions';
import { TradeForm } from './TradeForm';
import { TradeHistory } from './TradeHistory';
import { TradeCalendar } from './TradeCalendar';
import { Summary } from './Summary';
import { PeriodSummary } from './PeriodSummary';
import { LotCalculator } from './LotCalculator';

export function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const userTrades = await fetchUserData();
        setTrades(userTrades || []);
      } catch (error) {
        console.error('Erro ao carregar trades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrades();
  }, []);

  const handleNewTrade = (newTrade: Trade) => {
    setTrades((prevTrades) => [...prevTrades, newTrade]);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== id));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'history':
        return (
          <div className="space-y-6">
            <TradeForm onSubmit={handleNewTrade} />
            {trades.length > 0 ? (
              <TradeHistory trades={trades} onDeleteTrade={handleDeleteTrade} />
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                <p className="text-gray-400">Comece adicionando seu primeiro trade!</p>
              </div>
            )}
          </div>
        );
      case 'calendar':
        return <TradeCalendar trades={trades} />;
      case 'summary':
        return <Summary trades={trades} />;
      case 'period':
        return <PeriodSummary trades={trades} />;
      case 'calculator':
        return <LotCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Histórico
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'calendar'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Calendário
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'summary'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Resumo
          </button>
          <button
            onClick={() => setActiveTab('period')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'period'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Períodos
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Calculadora
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}