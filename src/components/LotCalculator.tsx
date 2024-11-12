import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, ArrowDownUp, CandlestickChart } from 'lucide-react';

export function LotCalculator() {
  const [balance, setBalance] = useState<string>('');
  const [risk, setRisk] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [pair, setPair] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [lotSize, setLotSize] = useState<number | null>(null);

  const isJPYPair = pair.includes('JPY');

  const calculateLotSize = () => {
    if (!balance || !risk || !stopLoss || !pair || !currentPrice) return;

    const riskAmount = Number(balance) * (Number(risk) / 100);
    const pips = Number(stopLoss);
    
    let pipValueInDollars;
    if (isJPYPair) {
      pipValueInDollars = (0.01 * 100000) / Number(currentPrice);
    } else {
      pipValueInDollars = (0.0001 * 100000) * Number(currentPrice);
    }
    
    const calculatedLotSize = riskAmount / (pips * pipValueInDollars);
    setLotSize(Math.round(calculatedLotSize * 100) / 100);
  };

  useEffect(() => {
    calculateLotSize();
  }, [balance, risk, stopLoss, pair, currentPrice]);

  const handlePairChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setPair(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-purple-400" />
        Calculadora de Lote
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Saldo da Conta
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Risco (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                placeholder="1"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              StopLoss (pips)
            </label>
            <div className="relative">
              <ArrowDownUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                placeholder="50"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Paridade
            </label>
            <input
              type="text"
              value={pair}
              onChange={handlePairChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
              placeholder="EURUSD"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Preço Atual
            </label>
            <div className="relative">
              <CandlestickChart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                placeholder={isJPYPair ? "130.50" : "1.0500"}
                step="0.00001"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 flex flex-col justify-center items-center">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Tamanho do Lote Recomendado</h3>
          {lotSize !== null ? (
            <>
              <p className="text-4xl font-bold text-purple-400 mb-2">
                {lotSize.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">
                lotes ({(lotSize * 100000).toLocaleString()} unidades)
              </p>
              {balance && risk && (
                <p className="text-sm text-gray-400 mt-4">
                  Risco monetário: ${(Number(balance) * (Number(risk) / 100)).toFixed(2)}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center">
              Preencha todos os campos para calcular o tamanho do lote
            </p>
          )}
        </div>
      </div>
    </div>
  );
}