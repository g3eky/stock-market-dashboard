import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchBar from './SearchBar';
import MarketOverview from './MarketOverview';
import StockChart from './StockChart';
import WatchList from './WatchList';
import { fetchMultipleQuotes, popularStocks } from '../services/stockApi';
import { stockData } from '../data/stockData';

const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8),
  minHeight: '400px',
}));

const Dashboard = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  useEffect(() => {
    const fetchWatchlistData = async () => {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      try {
        // Get default watchlist symbols
        const watchlistSymbols = popularStocks
          .filter(stock => ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'].includes(stock.symbol))
          .map(stock => stock.symbol);
        
        // Fetch quotes for watchlist stocks
        const quotes = await fetchMultipleQuotes(watchlistSymbols);
        
        // Combine with stock names
        const watchlistWithNames = quotes.map(quote => {
          const stockInfo = popularStocks.find(stock => stock.symbol === quote.symbol);
          return {
            ...quote,
            name: stockInfo ? stockInfo.name : quote.symbol,
            sector: stockInfo ? stockInfo.sector : 'N/A'
          };
        });
        
        setWatchlistData(watchlistWithNames);
      } catch (err) {
        console.error('Error fetching watchlist data:', err);
        
        // Use fallback data
        const fallbackWatchlist = stockData
          .filter(stock => ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'].includes(stock.symbol))
          .map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            sector: stock.sector
          }));
        
        if (fallbackWatchlist.length > 0) {
          console.log('Using fallback watchlist data');
          setWatchlistData(fallbackWatchlist);
          setUsingFallbackData(true);
        } else {
          setError('Failed to fetch watchlist data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlistData();
    
    // Refresh watchlist data every 5 minutes
    const intervalId = setInterval(fetchWatchlistData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // If initial loading, show loading indicator
  if (loading && watchlistData.length === 0) {
    return (
      <DashboardContainer maxWidth="lg">
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading dashboard data...
          </Typography>
        </LoadingContainer>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Stock Market Dashboard
      </Typography>
      
      <SearchBar />
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <MarketOverview />
          <StockChart />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <WatchList stocks={watchlistData} usingFallbackData={usingFallbackData} />
        </Box>
      </Box>
    </DashboardContainer>
  );
};

export default Dashboard; 