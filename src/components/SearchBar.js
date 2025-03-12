import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Autocomplete, 
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { searchStocks, popularStocks } from '../services/stockApi';
import { stockData } from '../data/stockData';

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
}));

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  // Fetch search results when search query changes
  useEffect(() => {
    let active = true;
    
    if (!searchQuery) {
      setOptions(popularStocks);
      return undefined;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setUsingFallbackData(false);
      
      try {
        const results = await searchStocks(searchQuery);
        
        if (active) {
          // Format results to match the expected structure
          const formattedResults = results.map(item => ({
            symbol: item.symbol,
            name: item.name,
            type: item.type,
            region: item.region
          }));
          
          setOptions(formattedResults);
        }
      } catch (error) {
        console.error('Error searching stocks:', error);
        
        // Use fallback data for search
        if (active) {
          const query = searchQuery.toLowerCase();
          const fallbackResults = stockData.filter(stock => 
            stock.symbol.toLowerCase().includes(query) || 
            stock.name.toLowerCase().includes(query)
          ).map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            type: 'Equity',
            region: 'United States'
          }));
          
          setOptions(fallbackResults);
          setUsingFallbackData(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);
  
  // Initialize with popular stocks
  useEffect(() => {
    setOptions(popularStocks);
  }, []);
  
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.length >= 2) {
      setSearchQuery(newInputValue);
    }
  };
  
  const handleOptionSelect = (event, value) => {
    if (value) {
      // Dispatch custom event when a stock is selected
      const stockSelectedEvent = new CustomEvent('stockSelected', {
        detail: { symbol: value.symbol }
      });
      window.dispatchEvent(stockSelectedEvent);
    }
  };
  
  return (
    <SearchContainer>
      {usingFallbackData && (
        <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
          Using simulated search data due to API limitations.
        </Alert>
      )}
      
      <Autocomplete
        id="stock-search"
        sx={{ width: '100%' }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleOptionSelect}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options}
        getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {option.symbol}
                </Typography>
                <Typography variant="body2">
                  {option.name}
                </Typography>
              </Box>
              {option.type && option.region && (
                <Typography variant="caption" color="text.secondary">
                  {option.type} • {option.region}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        loading={loading}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for stocks"
            placeholder="Enter company name or symbol"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <SearchIcon color="action" sx={{ ml: 1, mr: 0.5 }} />
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </SearchContainer>
  );
};

export default SearchBar; 