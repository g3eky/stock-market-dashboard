import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { stockData } from '../data/stockData'; // Keep for fallback
import SimilarStocks from './SimilarStocks';
import { 
  fetchStockTimeSeries, 
  fetchCompanyOverview, 
  fetchQuote,
  popularStocks
} from '../services/stockApi';

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const MetricItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  minWidth: '100px',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '400px',
}));

const StockChart = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [timeRange, setTimeRange] = useState('1M');
  const [stockList, setStockList] = useState(popularStocks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockTimeSeriesData, setStockTimeSeriesData] = useState(null);
  const [companyOverview, setCompanyOverview] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  
  // Fetch stock data when selected stock changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch time series data
        const timeSeriesData = await fetchStockTimeSeries(selectedStock);
        setStockTimeSeriesData(timeSeriesData);
        
        // Fetch company overview
        const overview = await fetchCompanyOverview(selectedStock);
        setCompanyOverview(overview);
        
        // Fetch latest quote
        const quote = await fetchQuote(selectedStock);
        setQuoteData(quote);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedStock]);
  
  // Listen for stock selection events from the search bar
  useEffect(() => {
    const handleStockSelected = (event) => {
      const { symbol } = event.detail;
      if (symbol) {
        setSelectedStock(symbol);
      }
    };
    
    window.addEventListener('stockSelected', handleStockSelected);
    
    return () => {
      window.removeEventListener('stockSelected', handleStockSelected);
    };
  }, []);
  
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };
  
  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    if (!stockTimeSeriesData) return [];
    
    switch (timeRange) {
      case '1W':
        return stockTimeSeriesData.slice(0, 7);
      case '1M':
        return stockTimeSeriesData.slice(0, 30);
      case '3M':
        return stockTimeSeriesData.slice(0, 90);
      case '1Y':
        return stockTimeSeriesData;
      default:
        return stockTimeSeriesData.slice(0, 30);
    }
  };
  
  const filteredData = getFilteredData();
  
  // Format data for candlestick chart
  const candlestickData = filteredData.map(item => ({
    x: new Date(item.date).getTime(),
    y: [item.open, item.high, item.low, item.close]
  }));
  
  // Format data for volume chart
  const volumeData = filteredData.map(item => ({
    x: new Date(item.date).getTime(),
    y: item.volume,
    color: item.close >= item.open ? '#4CAF50' : '#FF5252'
  }));
  
  // Candlestick chart options
  const candlestickOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      id: 'candles',
      toolbar: {
        autoSelected: 'pan',
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#4CAF50',
          downward: '#FF5252'
        },
        wick: {
          useFillColor: true
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleDateString();
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: function(val) {
          return '$' + val.toFixed(2);
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    },
    tooltip: {
      enabled: true,
      intersect: false,
      shared: false,
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]).toLocaleDateString();
        
        return (
          '<div class="apexcharts-tooltip-candlestick">' +
          '<div>Date: <b>' + date + '</b></div>' +
          '<div>Open: <b>$' + o.toFixed(2) + '</b></div>' +
          '<div>High: <b>$' + h.toFixed(2) + '</b></div>' +
          '<div>Low: <b>$' + l.toFixed(2) + '</b></div>' +
          '<div>Close: <b>$' + c.toFixed(2) + '</b></div>' +
          '</div>'
        );
      }
    }
  };
  
  // Volume chart options
  const volumeOptions = {
    chart: {
      type: 'bar',
      height: 160,
      id: 'volume',
      brush: {
        enabled: true,
        target: 'candles'
      },
      selection: {
        enabled: true,
        xaxis: {
          min: filteredData.length > 0 ? new Date(filteredData[filteredData.length - 1].date).getTime() : null,
          max: filteredData.length > 0 ? new Date(filteredData[0].date).getTime() : null
        }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        colors: {
          ranges: [{
            from: 0,
            to: 1000000000,
            color: '#546E7A'
          }]
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleDateString();
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return (val / 1000000).toFixed(1) + 'M';
        }
      }
    },
    tooltip: {
      enabled: true,
      intersect: false,
      shared: true,
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const volume = w.globals.series[seriesIndex][dataPointIndex];
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]).toLocaleDateString();
        
        return (
          '<div class="apexcharts-tooltip-volume">' +
          '<div>Date: <b>' + date + '</b></div>' +
          '<div>Volume: <b>' + volume.toLocaleString() + '</b></div>' +
          '</div>'
        );
      }
    }
  };
  
  // If loading, show loading indicator
  if (loading) {
    return (
      <ChartContainer elevation={3}>
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading stock data...
          </Typography>
        </LoadingContainer>
      </ChartContainer>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <ChartContainer elevation={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Please try again later or select a different stock.
        </Typography>
      </ChartContainer>
    );
  }
  
  // If no data yet, show loading
  if (!stockTimeSeriesData || stockTimeSeriesData.length === 0 || !quoteData) {
    return (
      <ChartContainer elevation={3}>
        <LoadingContainer>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading stock data...
          </Typography>
        </LoadingContainer>
      </ChartContainer>
    );
  }
  
  // Get company name from overview or fallback to stock list
  const getCompanyName = () => {
    if (companyOverview && companyOverview.Name) {
      return companyOverview.Name;
    }
    
    const stockInfo = stockList.find(stock => stock.symbol === selectedStock);
    return stockInfo ? stockInfo.name : selectedStock;
  };
  
  // Get sector from overview or fallback to stock list
  const getSector = () => {
    if (companyOverview && companyOverview.Sector) {
      return companyOverview.Sector;
    }
    
    const stockInfo = stockList.find(stock => stock.symbol === selectedStock);
    return stockInfo ? stockInfo.sector : 'N/A';
  };
  
  // Get industry from overview
  const getIndustry = () => {
    return companyOverview && companyOverview.Industry ? companyOverview.Industry : 'N/A';
  };
  
  return (
    <>
      <ChartContainer elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {getCompanyName()} ({selectedStock})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Chip 
                label={getSector()} 
                size="small" 
                sx={{ mr: 1, backgroundColor: 'rgba(25, 118, 210, 0.1)', color: 'primary.main' }} 
              />
              <Typography variant="body2" color="text.secondary">
                {getIndustry()}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="stock-select-label">Stock</InputLabel>
              <Select
                labelId="stock-select-label"
                id="stock-select"
                value={selectedStock}
                label="Stock"
                onChange={handleStockChange}
                size="small"
              >
                {stockList.map((stock) => (
                  <MenuItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
            >
              <ToggleButton value="1W">1W</ToggleButton>
              <ToggleButton value="1M">1M</ToggleButton>
              <ToggleButton value="3M">3M</ToggleButton>
              <ToggleButton value="1Y">1Y</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
            ${quoteData.price.toFixed(2)}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: quoteData.change >= 0 ? 'success.main' : 'error.main',
              fontWeight: 'bold',
            }}
          >
            {quoteData.change >= 0 ? '+' : ''}{quoteData.change.toFixed(2)} ({quoteData.changePercent.toFixed(2)}%)
          </Typography>
        </Box>
        
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box sx={{ height: 350, mb: 1 }}>
              <ReactApexChart 
                options={candlestickOptions} 
                series={[{ data: candlestickData }]} 
                type="candlestick" 
                height={350} 
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ height: 160 }}>
              <ReactApexChart 
                options={volumeOptions} 
                series={[{ name: 'Volume', data: volumeData }]} 
                type="bar" 
                height={160} 
              />
            </Box>
          </Grid>
        </Grid>
        
        {companyOverview && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Key Metrics
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <MetricItem>
                <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {companyOverview.PERatio !== 'None' ? parseFloat(companyOverview.PERatio).toFixed(2) : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">EPS</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${companyOverview.EPS !== 'None' ? parseFloat(companyOverview.EPS).toFixed(2) : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${companyOverview.MarketCapitalization ? (parseFloat(companyOverview.MarketCapitalization) / 1000000000).toFixed(2) + 'B' : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">Revenue</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${companyOverview.RevenueTTM ? (parseFloat(companyOverview.RevenueTTM) / 1000000000).toFixed(2) + 'B' : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {companyOverview.ProfitMargin !== 'None' ? (parseFloat(companyOverview.ProfitMargin) * 100).toFixed(2) + '%' : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">Dividend Yield</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {companyOverview.DividendYield !== 'None' ? (parseFloat(companyOverview.DividendYield) * 100).toFixed(2) + '%' : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">52W High</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${companyOverview['52WeekHigh'] ? parseFloat(companyOverview['52WeekHigh']).toFixed(2) : 'N/A'}
                </Typography>
              </MetricItem>
              
              <MetricItem>
                <Typography variant="body2" color="text.secondary">52W Low</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${companyOverview['52WeekLow'] ? parseFloat(companyOverview['52WeekLow']).toFixed(2) : 'N/A'}
                </Typography>
              </MetricItem>
            </Box>
          </>
        )}
      </ChartContainer>
      
      {companyOverview && (
        <SimilarStocks 
          selectedStock={selectedStock} 
          sector={getSector()}
          peRatio={companyOverview.PERatio !== 'None' ? parseFloat(companyOverview.PERatio) : null}
        />
      )}
    </>
  );
};

export default StockChart; 