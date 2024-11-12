import React, { useState } from 'react';
import { Trade } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

interface PeriodSummaryProps {
  trades: Trade[];
}

export function PeriodSummary({ trades }: PeriodSummaryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getPeriodData = () => {
    const data: { [key: string]: { profit: number; trades: number; wins: number } } = {};

    trades.forEach(trade => {
      const date = new Date(trade.date);
      let periodKey: string;

      if (selectedPeriod === 'weekly') {
        const week = Math.ceil((date.getDate() + date.getDay()) / 7);
        periodKey = `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
      } else if (selectedPeriod === 'monthly') {
        periodKey = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      } else {
        periodKey = date.getFullYear().toString();
      }

      if (!data[periodKey]) {
        data[periodKey] = { profit: 0, trades: 0, wins: 0 };
      }

      data[periodKey].profit += trade.profit;
      data[periodKey].trades += 1;
      if (trade.profit > 0) data[periodKey].wins += 1;
    });

    return Object.entries(data).map(([period, stats]) => ({
      period,
      profit: stats.profit,
      trades: stats.trades,
      winRate: (stats.wins / stats.trades) * 100,
    }));
  };

  const periodData = getPeriodData();
  const totalProfit = periodData.reduce((sum, period) => sum + period.profit, 0);
  const avgProfit = totalProfit / periodData.length;
  const bestPeriod = Math.max(...periodData.map(p => p.profit));
  const worstPeriod = Math.min(...periodData.map(p => p.profit));

  const formatPeriodLabel = (period: string) => {
    if (selectedPeriod === 'weekly') {
      return `S${period.split('-W')[1]}`;
    } else if (selectedPeriod === 'monthly') {
      return period.split(' ')[0].substring(0, 3);
    }
    return period;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
          <p className="text-gray-300 mb-1">{label}</p>
          <p className={`text-lg font-medium ${payload[0].value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-sm text-blue-400">
              Taxa de Acerto: {payload[1].value.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setSelectedPeriod('weekly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'weekly'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Semanal
        </button>
        <button
          onClick={() => setSelectedPeriod('monthly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'monthly'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setSelectedPeriod('yearly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'yearly'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Anual
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lucro Total"
          value={formatCurrency(totalProfit)}
          icon={DollarSign}
          colorClass="bg-green-500/20 text-green-500"
        />
        <StatCard
          title="Média por Período"
          value={formatCurrency(avgProfit)}
          icon={BarChart2}
          colorClass="bg-blue-500/20 text-blue-500"
        />
        <StatCard
          title="Melhor Período"
          value={formatCurrency(bestPeriod)}
          icon={TrendingUp}
          colorClass="bg-purple-500/20 text-purple-500"
        />
        <StatCard
          title="Pior Período"
          value={formatCurrency(worstPeriod)}
          icon={Calendar}
          colorClass="bg-red-500/20 text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Lucro por Período</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={periodData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="period"
                  tickFormatter={formatPeriodLabel}
                  stroke="#9CA3AF"
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${Math.abs(value) >= 1000 ? 
                    (value / 1000).toFixed(1) + 'k' : value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="profit"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Taxa de Acerto por Período</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={periodData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="period"
                  tickFormatter={formatPeriodLabel}
                  stroke="#9CA3AF"
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}