import React from 'react';
import { Trade } from '../types';
import { Trash2 } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
  onDeleteTrade: (id: string) => void;
}

export function TradeHistory({ trades, onDeleteTrade }: TradeHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderMobileCard = (trade: Trade) => (
    <div key={trade.id} className="bg-gray-700 p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-300">{formatDate(trade.date)}</p>
          <p className="text-lg font-medium text-white">{trade.pair}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          trade.type === 'BUY' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {trade.type === 'BUY' ? 'COMPRA' : 'VENDA'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Entrada</p>
          <p className="text-white">{trade.entryPrice.toFixed(5)}</p>
        </div>
        <div>
          <p className="text-gray-400">Saída</p>
          <p className="text-white">{trade.exitPrice.toFixed(5)}</p>
        </div>
        <div>
          <p className="text-gray-400">Lotes</p>
          <p className="text-white">{trade.lots}</p>
        </div>
        <div>
          <p className="text-gray-400">Lucro</p>
          <p className={`font-medium ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            $ {trade.profit.toFixed(2)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDeleteTrade(trade.id)}
        className="w-full mt-2 text-red-400 hover:text-red-300 transition-colors py-2 flex items-center justify-center gap-2 border border-red-400/20 rounded-lg"
      >
        <Trash2 className="w-4 h-4" />
        Excluir
      </button>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      {/* Mobile View */}
      <div className="sm:hidden space-y-4 p-4">
        {trades.map(renderMobileCard)}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Par</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entrada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Saída</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lotes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lucro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(trade.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.pair}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    trade.type === 'BUY' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                  }`}>
                    {trade.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.entryPrice.toFixed(5)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.exitPrice.toFixed(5)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{trade.lots}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  $ {trade.profit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => onDeleteTrade(trade.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Excluir trade"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}