import React from 'react';
import { Trade } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';

interface SummaryProps {
  trades: Trade[];
}

export function Summary({ trades }: SummaryProps) {
  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getPairStats = () => {
    const stats = trades.reduce((acc, trade) => {
      if (!acc[trade.pair]) {
        acc[trade.pair] = {
          wins: 0,
          losses: 0,
          totalProfit: 0,
          tradesCount: 0,
        };
      }
      acc[trade.pair].tradesCount++;
      acc[trade.pair].totalProfit += trade.profit;
      if (trade.profit > 0) {
        acc[trade.pair].wins++;
      } else {
        acc[trade.pair].losses++;
      }
      return acc;
    }, {} as Record<string, { wins: number; losses: number; totalProfit: number; tradesCount: number }>);

    return Object.entries(stats)
      .map(([pair, data]) => ({
        name: pair,
        value: data.totalProfit,
        winRate: (data.wins / data.tradesCount) * 100,
        trades: data.tradesCount,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getPerformanceMetrics = () => {
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit <= 0);
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const avgWinning = winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length;
    const avgLosing = losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length;

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      totalProfit,
      avgProfit: totalProfit / trades.length,
      avgWinning,
      avgLosing,
      profitFactor: Math.abs(avgWinning / avgLosing),
      maxConsecutiveWins: getMaxConsecutive(trades, true),
      maxConsecutiveLosses: getMaxConsecutive(trades, false),
    };
  };

  const getMaxConsecutive = (trades: Trade[], isWins: boolean) => {
    let max = 0;
    let current = 0;
    trades.forEach(trade => {
      if ((trade.profit > 0) === isWins) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    });
    return max;
  };

  const getRiskRewardData = () => {
    return trades.map((trade, index) => {
      const previousTrades = trades.slice(0, index + 1);
      const cumulativeProfit = previousTrades.reduce((sum, t) => sum + t.profit, 0);
      return {
        trade: index + 1,
        profit: cumulativeProfit,
        date: new Date(trade.date).toLocaleDateString(),
      };
    });
  };

  const metrics = getPerformanceMetrics();
  const pairStats = getPairStats();

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
          <p className="text-gray-300">{label}</p>
          <p className="text-lg font-medium text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Trades"
          value={metrics.totalTrades}
          icon={BarChart2}
          colorClass="bg-purple-500/20 text-purple-500"
        />
        <StatCard
          title="Taxa de Acerto"
          value={`${metrics.winRate.toFixed(1)}%`}
          icon={TrendingUp}
          colorClass="bg-green-500/20 text-green-500"
        />
        <StatCard
          title="Fator de Lucro"
          value={metrics.profitFactor.toFixed(2)}
          icon={TrendingDown}
          colorClass="bg-blue-500/20 text-blue-500"
        />
        <StatCard
          title="Lucro Total"
          value={formatCurrency(metrics.totalProfit)}
          icon={DollarSign}
          colorClass="bg-yellow-500/20 text-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resultados por Par */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Performance por Par</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pairStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value, winRate }) => 
                    `${name}: ${formatCurrency(value)} (${winRate.toFixed(1)}%)`
                  }
                >
                  {pairStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Curva de Equity */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Curva de Equity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getRiskRewardData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="trade" 
                  stroke="#9CA3AF"
                  label={{ value: 'Número do Trade', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  label={{ 
                    value: 'Lucro Acumulado ($)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Sequência de Trades</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Máx. Vitórias Consecutivas</span>
              <span className="text-green-400 font-medium">{metrics.maxConsecutiveWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Máx. Perdas Consecutivas</span>
              <span className="text-red-400 font-medium">{metrics.maxConsecutiveLosses}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Médias</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ganho Médio</span>
              <span className="text-green-400 font-medium">{formatCurrency(metrics.avgWinning)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Perda Média</span>
              <span className="text-red-400 font-medium">{formatCurrency(metrics.avgLosing)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Distribuição</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Trades Vencedores</span>
              <span className="text-green-400 font-medium">{metrics.winningTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Trades Perdedores</span>
              <span className="text-red-400 font-medium">{metrics.losingTrades}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}