import React, { useState, useEffect } from 'react';
import { Target, Brain, Calendar, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  startDate: string;
  endDate?: string;
}

interface GoalsProps {
  trades: Trade[];
}

export function Goals({ trades }: GoalsProps) {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('tradeGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: 'daily',
    target: 0,
    startDate: new Date().toISOString().split('T')[0],
  });
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  useEffect(() => {
    localStorage.setItem('tradeGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (newGoal.target && newGoal.type && newGoal.startDate) {
      const goal: Goal = {
        id: Date.now().toString(),
        type: newGoal.type as 'daily' | 'weekly' | 'monthly',
        target: Number(newGoal.target),
        startDate: newGoal.startDate,
        endDate: newGoal.endDate,
      };
      setGoals([...goals, goal]);
      setNewGoal({
        type: 'daily',
        target: 0,
        startDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const analyzeProgress = (goal: Goal) => {
    // Implementar análise de progresso baseada nos trades
    const relevantTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const startDate = new Date(goal.startDate);
      const endDate = goal.endDate ? new Date(goal.endDate) : new Date();
      return tradeDate >= startDate && tradeDate <= endDate;
    });

    const totalProfit = relevantTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const progress = (totalProfit / goal.target) * 100;

    return {
      currentValue: totalProfit,
      progress: Math.min(progress, 100),
      remaining: Math.max(goal.target - totalProfit, 0),
    };
  };

  const getAIAnalysis = () => {
    // Simular análise de IA baseada no histórico
    const winRate = trades.filter(t => t.profit > 0).length / trades.length * 100;
    const avgProfit = trades.reduce((sum, t) => sum + t.profit, 0) / trades.length;

    return (
      <div className="space-y-4 text-gray-300">
        <p>Com base no seu histórico de trades:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Sua taxa de acerto é de {winRate.toFixed(2)}%</li>
          <li>Seu lucro médio por trade é $ {avgProfit.toFixed(2)}</li>
          <li>Recomendações para atingir suas metas:</li>
          <ul className="list-circle pl-5 space-y-1 mt-2">
            <li>Mantenha um diário detalhado de trades</li>
            <li>Estabeleça stop loss consistente</li>
            <li>Foque nos pares mais lucrativos</li>
            <li>Evite operar em períodos de alta volatilidade</li>
          </ul>
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Definir Metas</h2>
        <button
          onClick={() => setShowAIAnalysis(!showAIAnalysis)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Análise com IA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Nova Meta</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de Meta
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
                >
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Valor Alvo ($)
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={newGoal.startDate}
                  onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data Final (opcional)
                </label>
                <input
                  type="date"
                  value={newGoal.endDate || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
                />
              </div>
              <button
                onClick={addGoal}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Adicionar Meta
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Metas Atuais</h3>
            <div className="space-y-4">
              {goals.map(goal => {
                const progress = analyzeProgress(goal);
                return (
                  <div key={goal.id} className="bg-gray-600 rounded-lg p-4 relative group">
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 capitalize">{goal.type}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-white">$ {goal.target.toFixed(2)}</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            {progress.progress.toFixed(1)}% Concluído
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            $ {progress.currentValue.toFixed(2)} / $ {goal.target.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                        <div
                          style={{ width: `${progress.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showAIAnalysis && (
        <div className="mt-6 bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Análise de IA
          </h3>
          {getAIAnalysis()}
          <div className="mt-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Faça uma pergunta sobre suas metas..."
                className="flex-1 bg-gray-600 border border-gray-500 rounded-lg p-2 text-white"
              />
              <button
                onClick={() => {
                  // Implementar lógica de resposta da IA
                  setAiQuestion('');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Perguntar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}