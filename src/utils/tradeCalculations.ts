export const calculateProfit = (
  entryPrice: number,
  exitPrice: number,
  lots: number,
  pair: string,
  type: 'BUY' | 'SELL'
): number => {
  // Tamanho do pip depende se o par contém JPY
  const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
  
  // Valor do pip em USD (padrão para 1 lote = 100,000 unidades)
  const standardLotSize = 100000;
  const actualLotSize = lots * standardLotSize;
  
  let pipValue: number;
  
  if (pair.includes('JPY')) {
    // Para pares com JPY, o valor do pip é (tamanho do pip * tamanho do lote) / preço atual
    pipValue = (pipSize * actualLotSize) / exitPrice;
  } else {
    // Para outros pares, o valor do pip é tamanho do pip * tamanho do lote
    pipValue = pipSize * actualLotSize;
  }

  // Cálculo da diferença em pips
  const priceDiff = type === 'BUY' 
    ? exitPrice - entryPrice 
    : entryPrice - exitPrice;
  
  const pipDiff = priceDiff / pipSize;
  
  // Cálculo final do lucro
  return pipDiff * pipValue;
};