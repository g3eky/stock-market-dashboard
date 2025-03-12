// Fake stock market data for demonstration purposes

// Stock symbols and their names
export const stockSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
];

// Generate random price data for the last 30 days with OHLC values
const generateHistoricalData = (basePrice, volatility) => {
  const data = [];
  let currentPrice = basePrice;
  
  // Generate data for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random price movement
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, 1); // Ensure price doesn't go below 1
    
    // Generate OHLC (Open, High, Low, Close) values
    const openPrice = currentPrice;
    const closePrice = parseFloat((currentPrice + (Math.random() - 0.5) * volatility * currentPrice * 0.5).toFixed(2));
    const highPrice = parseFloat(Math.max(openPrice, closePrice, openPrice + Math.random() * volatility * currentPrice).toFixed(2));
    const lowPrice = parseFloat(Math.min(openPrice, closePrice, openPrice - Math.random() * volatility * currentPrice).toFixed(2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: openPrice,
      high: highPrice,
      low: lowPrice,
      close: closePrice,
      price: closePrice, // Keep price for backward compatibility
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
    
    // Update current price for next iteration
    currentPrice = closePrice;
  }
  
  return data;
};

// Generate current stock data with historical prices
export const stockData = stockSymbols.map(stock => {
  const basePrice = Math.random() * 1000 + 50; // Random base price between 50 and 1050
  const volatility = Math.random() * 0.05 + 0.01; // Random volatility between 1% and 6%
  const historicalData = generateHistoricalData(basePrice, volatility);
  const currentPrice = historicalData[historicalData.length - 1].close;
  const previousPrice = historicalData[historicalData.length - 2].close;
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  
  return {
    ...stock,
    price: currentPrice,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    marketCap: parseFloat((currentPrice * (Math.random() * 10 + 1) * 1000000000).toFixed(2)),
    historicalData,
  };
});

// Market indices data
export const marketIndices = [
  {
    name: 'S&P 500',
    symbol: 'SPX',
    price: 4782.45,
    change: 23.15,
    changePercent: 0.49,
    historicalData: generateHistoricalData(4500, 0.01),
  },
  {
    name: 'Dow Jones',
    symbol: 'DJI',
    price: 38972.41,
    change: -34.12,
    changePercent: -0.09,
    historicalData: generateHistoricalData(38000, 0.008),
  },
  {
    name: 'NASDAQ',
    symbol: 'IXIC',
    price: 16752.23,
    change: 78.81,
    changePercent: 0.47,
    historicalData: generateHistoricalData(16000, 0.012),
  },
  {
    name: 'Russell 2000',
    symbol: 'RUT',
    price: 2028.97,
    change: 12.34,
    changePercent: 0.61,
    historicalData: generateHistoricalData(1900, 0.015),
  },
];

// Market sectors performance
export const sectorPerformance = [
  { name: 'Technology', change: 1.2 },
  { name: 'Healthcare', change: 0.8 },
  { name: 'Financials', change: -0.3 },
  { name: 'Consumer Discretionary', change: 0.5 },
  { name: 'Communication Services', change: 1.5 },
  { name: 'Industrials', change: 0.2 },
  { name: 'Consumer Staples', change: -0.1 },
  { name: 'Energy', change: -0.7 },
  { name: 'Utilities', change: 0.3 },
  { name: 'Real Estate', change: -0.4 },
  { name: 'Materials', change: 0.6 },
];

// Top gainers and losers
export const getTopGainers = () => {
  return [...stockData].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
};

export const getTopLosers = () => {
  return [...stockData].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
};

// Market news (fake data)
export const marketNews = [
  {
    id: 1,
    title: 'Tech Stocks Rally on Strong Earnings Reports',
    summary: 'Major tech companies exceeded analyst expectations, driving market gains.',
    source: 'Financial Times',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    title: 'Federal Reserve Signals Potential Rate Cut',
    summary: 'Central bank officials hint at possible interest rate reduction in coming months.',
    source: 'Wall Street Journal',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 3,
    title: 'Oil Prices Surge Amid Supply Concerns',
    summary: 'Global oil benchmarks climb as geopolitical tensions threaten supply chains.',
    source: 'Bloomberg',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 4,
    title: 'Retail Sales Beat Expectations in Q2',
    summary: 'Consumer spending shows resilience despite inflation pressures.',
    source: 'CNBC',
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 5,
    title: 'New IPO Sees Strong Market Debut',
    summary: 'Shares jump 30% on first day of trading, signaling investor confidence.',
    source: 'Reuters',
    date: new Date().toISOString().split('T')[0],
  },
]; 