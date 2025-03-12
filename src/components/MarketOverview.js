import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { fetchMultipleQuotes, marketIndices, fetchGlobalMarketStatus } from '../services/stockApi';
import { marketIndices as fallbackMarketIndices } from '../data/stockData';

const OverviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const IndexCard = styled(Box)(({ theme, positive }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: positive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '200px',
}));

const MarketOverview = () => {
  const [marketData, setMarketData] = useState([]);
  const [marketStatus, setMarketStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      try {
        // Fetch quotes for market indices
        const indexSymbols = marketIndices.map(index => index.symbol);
        const quotes = await fetchMultipleQuotes(indexSymbols);
        
        // Combine with index names
        const marketDataWithNames = quotes.map(quote => {
          const indexInfo = marketIndices.find(index => index.symbol === quote.symbol);
          return {
            ...quote,
            name: indexInfo ? indexInfo.name : quote.symbol
          };
        });
        
        setMarketData(marketDataWithNames);
        
        // Fetch global market status
        const status = await fetchGlobalMarketStatus();
        setMarketStatus(status);
      } catch (err) {
        console.error('Error fetching market data:', err);
        
        // Use fallback data
        if (fallbackMarketIndices && fallbackMarketIndices.length > 0) {
          console.log('Using fallback market data');
          setMarketData(fallbackMarketIndices);
          setMarketStatus({
            isOpen: new Date().getHours() >= 9 && new Date().getHours() < 16,
            currentTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
          setUsingFallbackData(true);
        } else {
          setError('Failed to fetch market data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketData();
    
    // Refresh market data every 5 minutes
    const intervalId = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // If loading, show loading indicator
  if (loading) {
    return (
      <OverviewContainer elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Market Overview
        </Typography>
        <LoadingContainer>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading market data...
          </Typography>
        </LoadingContainer>
      </OverviewContainer>
    );
  }
  
  // If error and no fallback data, show error message
  if (error && !usingFallbackData) {
    return (
      <OverviewContainer elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Market Overview
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </OverviewContainer>
    );
  }
  
  return (
    <OverviewContainer elevation={3}>
      {usingFallbackData && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Using simulated market data due to API limitations.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Market Overview
        </Typography>
        
        {marketStatus && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: marketStatus.isOpen ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            borderRadius: '16px',
            padding: '4px 12px',
          }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: marketStatus.isOpen ? 'success.main' : 'error.main',
                mr: 1
              }} 
            />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {marketStatus.isOpen ? 'Markets Open' : 'Markets Closed'}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        {marketData.map((index) => (
          <Grid item xs={12} sm={6} md={4} key={index.symbol}>
            <IndexCard positive={index.change >= 0}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {index.name}
              </Typography>
              
              <Typography variant="h6" sx={{ fontWeight: 'bold', my: 1 }}>
                {index.price.toFixed(2)}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                {index.change >= 0 ? (
                  <ArrowUpwardIcon fontSize="small" sx={{ color: 'success.main', mr: 0.5 }} />
                ) : (
                  <ArrowDownwardIcon fontSize="small" sx={{ color: 'error.main', mr: 0.5 }} />
                )}
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: index.change >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </Typography>
              </Box>
            </IndexCard>
          </Grid>
        ))}
      </Grid>
    </OverviewContainer>
  );
};

export default MarketOverview; 