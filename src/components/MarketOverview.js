import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { marketIndices } from '../data/stockData';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const MarketOverview = () => {
  return (
    <Box sx={{ flexGrow: 1, mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Market Overview
      </Typography>
      <Grid container spacing={3}>
        {marketIndices.map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index.symbol}>
            <Item elevation={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {index.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {index.symbol}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: index.changePercent >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                    color: index.changePercent >= 0 ? 'success.main' : 'error.main',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  {index.changePercent >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {index.changePercent.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="h4" component="div">
                  {index.price.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: index.change >= 0 ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} pts
                </Typography>
              </Box>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MarketOverview; 