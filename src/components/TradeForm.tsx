import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Trade, TradeFormData } from '../types';
import { calculateProfit } from '../utils/tradeCalculations';
import { saveUserData } from '../firestoreFunctions';

interface TradeFormProps {
  onSubmit?: (trade: Trade) => void;
}

export function TradeForm({ onSubmit }: TradeFormProps) {
  const [formData, setFormData] = useState<TradeFormData>({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    type: 'BUY',
    entryPrice: '',
    exitPrice: '',
    lots: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profit = calculateProfit(
      Number(formData.entryPrice),
      Number(formData.exitPrice),
      Number(formData.lots),
      formData.pair,
      formData.type
    );

    // Create a Date object from the form date and set it to noon UTC
    // This ensures consistent date handling across timezones
    const tradeDate = new Date(formData.date);
    tradeDate.setUTCHours(12, 0, 0, 0);

    const trade: Trade = {
      id: Date.now().toString(),
      date: tradeDate.toISOString(), // Store as ISO string for consistency
      pair: formData.pair,
      type: formData.type,
      entryPrice: Number(formData.entryPrice),
      exitPrice: Number(formData.exitPrice),
      lots: Number(formData.lots),
      profit,
    };

    try {
      await saveUserData(trade);
      alert('Trade salvo com sucesso!');
      onSubmit?.(trade);

      setFormData({
        date: new Date().toISOString().split('T')[0],
        pair: '',
        type: 'BUY',
        entryPrice: '',
        exitPrice: '',
        lots: '',
      });
    } catch (error) {
      console.error('Erro ao salvar o trade:', error);
      alert('Erro ao salvar o trade. Tente novamente.');
    }
  };

  const handlePairChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setFormData({ ...formData, pair: value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 border border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Data
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Par
          </label>
          <input
            type="text"
            value={formData.pair}
            onChange={handlePairChange}
            placeholder="Ex: EURUSD"
            maxLength={6}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tipo
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'BUY' | 'SELL' })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="BUY">Compra</option>
            <option value="SELL">Venda</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Preço de Entrada
          </label>
          <input
            type="number"
            step="0.00001"
            value={formData.entryPrice}
            onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Preço de Saída
          </label>
          <input
            type="number"
            step="0.00001"
            value={formData.exitPrice}
            onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Lotes
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.lots}
            onChange={(e) => setFormData({ ...formData, lots: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Adicionar Trade</span>
          <span className="sm:hidden">Adicionar</span>
        </button>
      </div>
    </form>
  );
}