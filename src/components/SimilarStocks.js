import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchMultipleQuotes, fetchCompanyOverview, popularStocks } from '../services/stockApi';

const SimilarStocksContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '200px',
}));

const SimilarStocks = ({ selectedStock, sector, peRatio }) => {
  const [similarStocks, setSimilarStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSimilarStocks = async () => {
      if (!selectedStock || !sector || !peRatio) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get all stocks in the same sector
        const sectorStocks = popularStocks.filter(stock => 
          stock.symbol !== selectedStock && 
          stock.sector.toLowerCase() === sector.toLowerCase()
        );
        
        if (sectorStocks.length === 0) {
          setSimilarStocks([]);
          setLoading(false);
          return;
        }
        
        // Fetch quotes for all sector stocks
        const quotes = await fetchMultipleQuotes(sectorStocks.map(stock => stock.symbol));
        
        // Fetch company overviews for PE ratios
        const overviewPromises = sectorStocks.map(stock => 
          fetchCompanyOverview(stock.symbol)
        );
        
        const overviews = await Promise.all(overviewPromises);
        
        // Combine data and filter for stocks with lower PE ratios
        const stocksWithData = sectorStocks.map((stock, index) => {
          const overview = overviews[index];
          const quote = quotes.find(q => q.symbol === stock.symbol);
          
          if (!overview || !quote) return null;
          
          const stockPeRatio = overview.PERatio !== 'None' ? parseFloat(overview.PERatio) : null;
          
          return {
            symbol: stock.symbol,
            name: stock.name,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
            peRatio: stockPeRatio,
            industry: overview.Industry || 'N/A',
            peDifference: stockPeRatio && peRatio ? ((peRatio - stockPeRatio) / peRatio) * 100 : null
          };
        }).filter(stock => 
          stock !== null && 
          stock.peRatio !== null && 
          stock.peRatio < peRatio
        );
        
        // Sort by PE ratio difference (descending)
        stocksWithData.sort((a, b) => b.peDifference - a.peDifference);
        
        // Take top 5
        setSimilarStocks(stocksWithData.slice(0, 5));
      } catch (err) {
        console.error('Error fetching similar stocks:', err);
        setError('Failed to fetch similar stocks data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilarStocks();
  }, [selectedStock, sector, peRatio]);
  
  const handleRowClick = (symbol) => {
    // Dispatch custom event to update the chart
    const event = new CustomEvent('stockSelected', { 
      detail: { symbol } 
    });
    window.dispatchEvent(event);
  };
  
  // If no PE ratio or sector, don't show the component
  if (!peRatio || !sector) {
    return null;
  }
  
  // If loading, show loading indicator
  if (loading) {
    return (
      <SimilarStocksContainer elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Similar Stocks with Lower P/E Ratios
        </Typography>
        <LoadingContainer>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Finding similar stocks...
          </Typography>
        </LoadingContainer>
      </SimilarStocksContainer>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <SimilarStocksContainer elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Similar Stocks with Lower P/E Ratios
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </SimilarStocksContainer>
    );
  }
  
  // If no similar stocks found
  if (similarStocks.length === 0) {
    return (
      <SimilarStocksContainer elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Similar Stocks with Lower P/E Ratios
        </Typography>
        <Typography variant="body1">
          No stocks found in the same sector with lower P/E ratios.
        </Typography>
      </SimilarStocksContainer>
    );
  }
  
  return (
    <SimilarStocksContainer elevation={3}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Similar Stocks with Lower P/E Ratios
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">P/E Ratio</TableCell>
              <TableCell align="right">P/E Diff %</TableCell>
              <TableCell align="right">Daily Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {similarStocks.map((stock) => (
              <StyledTableRow 
                key={stock.symbol}
                onClick={() => handleRowClick(stock.symbol)}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  {stock.symbol}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stock.name}
                    {stock.industry && (
                      <Tooltip title={`Industry: ${stock.industry}`} arrow>
                        <InfoOutlinedIcon 
                          fontSize="small" 
                          sx={{ ml: 0.5, color: 'text.secondary', fontSize: '16px' }} 
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
                <TableCell align="right">{stock.peRatio.toFixed(2)}</TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: 'success.main',
                    fontWeight: 'bold'
                  }}
                >
                  {stock.peDifference.toFixed(2)}%
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: stock.change >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}
                >
                  {stock.change >= 0 ? (
                    <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                  )}
                  {Math.abs(stock.changePercent).toFixed(2)}%
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SimilarStocksContainer>
  );
};

export default SimilarStocks; 