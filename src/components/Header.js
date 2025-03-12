import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, InputBase, Badge, List, ListItem, ListItemText, Paper, Popper, ClickAwayListener } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { stockData } from '../data/stockData';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchResultsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  width: '100%',
  maxHeight: '300px',
  overflow: 'auto',
  marginTop: theme.spacing(1),
  boxShadow: theme.shadows[3],
}));

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);
    
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter stocks based on search term
    const filteredResults = stockData.filter(stock => 
      stock.symbol.toLowerCase().includes(value.toLowerCase()) || 
      stock.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setSearchResults(filteredResults);
  };

  const handleSearchItemClick = (stockSymbol) => {
    // Update the selected stock in the app state
    // For now, we'll just log it and close the search results
    console.log(`Selected stock: ${stockSymbol}`);
    setSearchTerm('');
    setSearchResults([]);
    setAnchorEl(null);
    
    // Here you would typically navigate to the stock details or update the chart
    // For example, you could use a global state manager or context to update the selected stock
    window.dispatchEvent(new CustomEvent('stockSelected', { detail: { symbol: stockSymbol } }));
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a2035' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
        >
          StockVision Dashboard
        </Typography>
        
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search stocks..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ClickAwayListener onClickAway={handleClickAway}>
            <div>
              {open && searchResults.length > 0 && (
                <Popper open={open} anchorEl={anchorEl} placement="bottom-start" style={{ width: anchorEl ? anchorEl.clientWidth : 'auto', zIndex: 1300 }}>
                  <SearchResultsContainer>
                    <List>
                      {searchResults.map((stock) => (
                        <ListItem 
                          button 
                          key={stock.symbol}
                          onClick={() => handleSearchItemClick(stock.symbol)}
                          sx={{ 
                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
                          }}
                        >
                          <ListItemText 
                            primary={`${stock.symbol} - ${stock.name}`}
                            secondary={`$${stock.price.toFixed(2)}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </SearchResultsContainer>
                </Popper>
              )}
            </div>
          </ClickAwayListener>
        </Search>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton size="large" color="inherit">
            <DarkModeIcon />
          </IconButton>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 