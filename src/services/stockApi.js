import axios from 'axios';

// Get API key from environment variables
const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache for API responses to reduce API calls
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch time series data for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} - Array of stock data points
 */
export const fetchStockTimeSeries = async (symbol) => {
  const cacheKey = `timeseries-${symbol}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }
  
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'full',
        apikey: API_KEY
      }
    });
    
    // Check for error messages
    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }
    
    // Check for API call limit
    if (response.data.Note) {
      console.warn('API Call Limit:', response.data.Note);
    }
    
    const timeSeriesData = response.data['Time Series (Daily)'];
    
    if (!timeSeriesData) {
      return [];
    }
    
    // Convert to array and format data
    const formattedData = Object.entries(timeSeriesData).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'], 10)
    }));
    
    // Sort by date (newest first)
    formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Cache the result
    apiCache.set(cacheKey, {
      data: formattedData,
      timestamp: Date.now()
    });
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching stock time series:', error);
    throw error;
  }
};

/**
 * Fetch company overview data
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} - Company overview data
 */
export const fetchCompanyOverview = async (symbol) => {
  const cacheKey = `overview-${symbol}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }
  
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: API_KEY
      }
    });
    
    // Check for error messages
    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }
    
    // Check for API call limit
    if (response.data.Note) {
      console.warn('API Call Limit:', response.data.Note);
    }
    
    // Cache the result
    apiCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
};

/**
 * Fetch global market status
 * @returns {Promise<Object>} - Market status data
 */
export const fetchGlobalMarketStatus = async () => {
  const cacheKey = 'market-status';
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }
  
  try {
    // Use SPY (S&P 500 ETF) as a proxy for market status
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: 'SPY',
        apikey: API_KEY
      }
    });
    
    // Check for error messages
    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }
    
    // Check for API call limit
    if (response.data.Note) {
      console.warn('API Call Limit:', response.data.Note);
    }
    
    // Get current time in New York (market time)
    const now = new Date();
    const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = nyTime.getDay();
    const hour = nyTime.getHours();
    
    // Check if market is open (9:30 AM - 4:00 PM ET, Monday-Friday)
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = hour >= 9 && hour < 16;
    const isOpen = isWeekday && isMarketHours;
    
    const marketStatus = {
      isOpen,
      currentTime: nyTime.toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // Cache the result
    apiCache.set(cacheKey, {
      data: marketStatus,
      timestamp: Date.now()
    });
    
    return marketStatus;
  } catch (error) {
    console.error('Error fetching market status:', error);
    throw error;
  }
};

/**
 * Search for stocks
 * @param {string} keywords - Search keywords
 * @returns {Promise<Array>} - Array of matching stocks
 */
export const searchStocks = async (keywords) => {
  const cacheKey = `search-${keywords}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }
  
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords,
        apikey: API_KEY
      }
    });
    
    // Check for error messages
    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }
    
    // Check for API call limit
    if (response.data.Note) {
      console.warn('API Call Limit:', response.data.Note);
    }
    
    const matches = response.data.bestMatches || [];
    
    // Format the results
    const formattedResults = matches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
      matchScore: parseFloat(match['9. matchScore'])
    }));
    
    // Cache the result
    apiCache.set(cacheKey, {
      data: formattedResults,
      timestamp: Date.now()
    });
    
    return formattedResults;
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

/**
 * Fetch quote data for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} - Quote data
 */
export const fetchQuote = async (symbol) => {
  const cacheKey = `quote-${symbol}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    const cachedData = apiCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
  }
  
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });
    
    // Check for error messages
    if (response.data['Error Message']) {
      console.error('API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }
    
    // Check for API call limit
    if (response.data.Note) {
      console.warn('API Call Limit:', response.data.Note);
    }
    
    const quote = response.data['Global Quote'];
    
    if (!quote || !quote['01. symbol']) {
      throw new Error(`No quote data found for ${symbol}`);
    }
    
    // Format the quote data
    const formattedQuote = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume'], 10),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: parseFloat(quote['08. previous close']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low'])
    };
    
    // Cache the result
    apiCache.set(cacheKey, {
      data: formattedQuote,
      timestamp: Date.now()
    });
    
    return formattedQuote;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetch quotes for multiple stocks
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Array>} - Array of quote data
 */
export const fetchMultipleQuotes = async (symbols) => {
  // Due to API rate limits, we need to fetch quotes one by one
  const quotes = [];
  
  for (const symbol of symbols) {
    try {
      const quote = await fetchQuote(symbol);
      quotes.push(quote);
      
      // Add a small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      // Continue with other symbols even if one fails
    }
  }
  
  return quotes;
};

// Popular tech stocks with their symbols and sectors
export const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial Services' },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology' },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
  { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology' }
];

// Market indices with their symbols and names
export const marketIndices = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'QQQ', name: 'Nasdaq' },
  { symbol: 'IWM', name: 'Russell 2000' },
  { symbol: 'VGK', name: 'FTSE Europe' },
  { symbol: 'EWJ', name: 'Nikkei 225' }
]; 