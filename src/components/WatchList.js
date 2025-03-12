import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const WatchListContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  height: '100%',
}));

const StockItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));

const StockSymbol = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginRight: theme.spacing(1),
}));

const StockPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StockChange = styled(Box)(({ theme, positive }) => ({
  display: 'flex',
  alignItems: 'center',
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  fontWeight: 'bold',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '200px',
}));

const WatchList = ({ stocks = [] }) => {
  const handleStockClick = (symbol) => {
    // Dispatch custom event to update the chart
    const event = new CustomEvent('stockSelected', { 
      detail: { symbol } 
    });
    window.dispatchEvent(event);
  };
  
  // If loading or no stocks, show loading indicator
  if (!stocks || stocks.length === 0) {
    return (
      <WatchListContainer elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Watchlist
        </Typography>
        <LoadingContainer>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading watchlist...
          </Typography>
        </LoadingContainer>
      </WatchListContainer>
    );
  }
  
  return (
    <WatchListContainer elevation={3}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Watchlist
      </Typography>
      
      <List disablePadding>
        {stocks.map((stock, index) => (
          <React.Fragment key={stock.symbol}>
            <StockItem onClick={() => handleStockClick(stock.symbol)}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StockSymbol variant="body1">{stock.symbol}</StockSymbol>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {stock.name}
                    </Typography>
                  </Box>
                  <StockPrice variant="body1">
                    ${stock.price.toFixed(2)}
                  </StockPrice>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {stock.sector}
                  </Typography>
                  
                  <StockChange positive={stock.change >= 0}>
                    {stock.change >= 0 ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </StockChange>
                </Box>
              </Box>
            </StockItem>
            
            {index < stocks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </WatchListContainer>
  );
};

export default WatchList; 