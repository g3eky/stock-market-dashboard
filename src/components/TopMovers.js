import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { getTopGainers, getTopLosers } from '../data/stockData';

const MoversContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  borderRadius: theme.shape.borderRadius,
}));

const TopMovers = () => {
  const topGainers = getTopGainers();
  const topLosers = getTopLosers();
  
  return (
    <Box sx={{ flexGrow: 1, mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Top Movers
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MoversContainer elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Top Gainers
              </Typography>
            </Box>
            <List>
              {topGainers.map((stock, index) => (
                <React.Fragment key={stock.symbol}>
                  <ListItem 
                    sx={{ 
                      py: 1.5,
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      cursor: 'pointer',
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={stock.symbol} 
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              fontWeight: 'bold',
                              backgroundColor: 'primary.main',
                              color: 'white',
                            }} 
                          />
                          <Typography variant="body2" noWrap>
                            {stock.name}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        ${stock.price.toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'success.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {stock.changePercent.toFixed(2)}%
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < topGainers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </MoversContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <MoversContainer elevation={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Top Losers
              </Typography>
            </Box>
            <List>
              {topLosers.map((stock, index) => (
                <React.Fragment key={stock.symbol}>
                  <ListItem 
                    sx={{ 
                      py: 1.5,
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      cursor: 'pointer',
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={stock.symbol} 
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              fontWeight: 'bold',
                              backgroundColor: 'primary.main',
                              color: 'white',
                            }} 
                          />
                          <Typography variant="body2" noWrap>
                            {stock.name}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        ${stock.price.toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'error.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < topLosers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </MoversContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopMovers; 