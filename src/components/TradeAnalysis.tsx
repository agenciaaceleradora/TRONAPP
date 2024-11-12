import React from 'react';
import { Trade } from '../types';
import { X } from 'lucide-react';

interface TradeAnalysisProps {
  trades: Trade[];
  onClose: () => void;
}

export function TradeAnalysis({ trades, onClose }: TradeAnalysisProps) {
  const calculateMetrics = () => {
    if (trades.length === 0) return null;

    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit <= 0);
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const profitValues = trades.map(t => t.profit);
    const maxProfit = Math.max(...profitValues);
    const maxLoss = Math.min(...profitValues);

    const pairs = trades.reduce((acc, trade) => {
      acc[trade.pair] = (acc[trade.pair] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bestPair = Object.entries(pairs).sort((a, b) => b[1] - a[1])[0];

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      totalProfit,
      averageProfit: totalProfit / trades.length,
      maxProfit,
      maxLoss,
      bestPair: bestPair ? bestPair[0] : 'N/A',
      profitFactor: Math.abs(
        winningTrades.reduce((sum, t) => sum + t.profit, 0) /
        losingTrades.reduce((sum, t) => sum + t.profit, 0)
      ),
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Análise Detalhada</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Estatísticas Gerais</h3>
              <div className="space-y-2">
                <p className="text-gray-300">Total de Trades: <span className="text-white font-medium">{metrics.totalTrades}</span></p>
                <p className="text-gray-300">Trades Vencedores: <span className="text-green-400 font-medium">{metrics.winningTrades}</span></p>
                <p className="text-gray-300">Trades Perdedores: <span className="text-red-400 font-medium">{metrics.losingTrades}</span></p>
                <p className="text-gray-300">Taxa de Acerto: <span className="text-purple-400 font-medium">{metrics.winRate.toFixed(2)}%</span></p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Análise de Lucro</h3>
              <div className="space-y-2">
                <p className="text-gray-300">Lucro Total: <span className={`font-medium ${metrics.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>R$ {metrics.totalProfit.toFixed(2)}</span></p>
                <p className="text-gray-300">Média por Trade: <span className={`font-medium ${metrics.averageProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>R$ {metrics.averageProfit.toFixed(2)}</span></p>
                <p className="text-gray-300">Maior Ganho: <span className="text-green-400 font-medium">R$ {metrics.maxProfit.toFixed(2)}</span></p>
                <p className="text-gray-300">Maior Perda: <span className="text-red-400 font-medium">R$ {metrics.maxLoss.toFixed(2)}</span></p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Métricas Avançadas</h3>
              <div className="space-y-2">
                <p className="text-gray-300">Par Mais Operado: <span className="text-purple-400 font-medium">{metrics.bestPair}</span></p>
                <p className="text-gray-300">Fator de Lucro: <span className="text-purple-400 font-medium">{metrics.profitFactor.toFixed(2)}</span></p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Recomendações</h3>
              <div className="space-y-2 text-gray-300">
                {metrics.winRate < 50 && (
                  <p>• Considere revisar sua estratégia de entrada, a taxa de acerto está abaixo do ideal.</p>
                )}
                {metrics.profitFactor < 1.5 && (
                  <p>• O fator de lucro está baixo, trabalhe em melhorar a relação risco/retorno.</p>
                )}
                {metrics.averageProfit < 0 && (
                  <p>• A média de lucro por trade está negativa, revise seu gerenciamento de risco.</p>
                )}
                {metrics.winRate >= 50 && metrics.profitFactor >= 1.5 && metrics.averageProfit > 0 && (
                  <p>• Sua estratégia está sólida! Continue monitorando e fazendo ajustes finos.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}