import React, { useEffect, useState } from 'react';
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
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { getSimilarStocksWithLowerPE, stockData } from '../data/stockData';

const SimilarStocksContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    cursor: 'pointer',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SimilarStocks = ({ selectedStock }) => {
  const [similarStocks, setSimilarStocks] = useState([]);
  const [currentStock, setCurrentStock] = useState(null);
  
  useEffect(() => {
    if (selectedStock) {
      const similar = getSimilarStocksWithLowerPE(selectedStock);
      setSimilarStocks(similar);
      
      const current = stockData.find(stock => stock.symbol === selectedStock);
      setCurrentStock(current);
    }
  }, [selectedStock]);
  
  const handleStockClick = (symbol) => {
    // Dispatch event to update the selected stock in the chart
    window.dispatchEvent(new CustomEvent('stockSelected', { detail: { symbol } }));
  };
  
  if (!currentStock || similarStocks.length === 0) {
    return null;
  }
  
  return (
    <SimilarStocksContainer elevation={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CompareArrowsIcon sx={{ mr: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Similar Stocks to {currentStock.name} with Lower P/E Ratio
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Stocks in the {currentStock.sector} sector that might be undervalued compared to {currentStock.symbol} (P/E: {currentStock.peRatio.toFixed(2)})
      </Typography>
      
      <TableContainer component={Box}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">P/E Ratio</TableCell>
              <TableCell align="right">P/E Diff</TableCell>
              <TableCell align="right">Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {similarStocks.map((stock) => {
              const peDifference = ((stock.peRatio - currentStock.peRatio) / currentStock.peRatio * 100).toFixed(2);
              
              return (
                <StyledTableRow key={stock.symbol} onClick={() => handleStockClick(stock.symbol)}>
                  <TableCell>
                    <Chip 
                      label={stock.symbol} 
                      size="small" 
                      sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Industry: ${stock.industry}`} arrow placement="top">
                      <Typography variant="body2">{stock.name}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{stock.peRatio.toFixed(2)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: 'success.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {peDifference}%
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: stock.change >= 0 ? 'success.main' : 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {stock.change >= 0 ? (
                      <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    {stock.changePercent.toFixed(2)}%
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </SimilarStocksContainer>
  );
};

export default SimilarStocks; 