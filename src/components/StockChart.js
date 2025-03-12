import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ComposedChart
} from 'recharts';
import { stockData } from '../data/stockData';

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, boxShadow: 3 }}>
        <Typography variant="body2">{`Date: ${label}`}</Typography>
        <Typography variant="body2" sx={{ color: payload[0].color }}>
          {`Price: $${payload[0].value.toFixed(2)}`}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {`Volume: ${payload[0].payload.volume.toLocaleString()}`}
        </Typography>
      </Paper>
    );
  }

  return null;
};

const VolumeTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, boxShadow: 3 }}>
        <Typography variant="body2">{`Date: ${label}`}</Typography>
        <Typography variant="body2" sx={{ color: '#2196f3' }}>
          {`Volume: ${payload[0].value.toLocaleString()}`}
        </Typography>
      </Paper>
    );
  }

  return null;
};

const StockChart = () => {
  const [selectedStock, setSelectedStock] = useState(stockData[0].symbol);
  const [timeRange, setTimeRange] = useState('1M');
  
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };
  
  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };
  
  const currentStock = stockData.find(stock => stock.symbol === selectedStock);
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    const data = currentStock.historicalData;
    switch (timeRange) {
      case '1W':
        return data.slice(-7);
      case '1M':
        return data.slice(-30);
      case '3M':
        return data.slice(-90);
      case '1Y':
        return data;
      default:
        return data.slice(-30);
    }
  };
  
  const filteredData = getFilteredData();
  
  // Calculate min and max for Y axis
  const prices = filteredData.map(item => item.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;

  // Calculate min and max for volume
  const volumes = filteredData.map(item => item.volume);
  const maxVolume = Math.max(...volumes) * 1.1;

  // Process data to include price change color
  const processedData = filteredData.map((item, index, array) => {
    const prevPrice = index > 0 ? array[index - 1].price : item.price;
    const priceChange = item.price - prevPrice;
    return {
      ...item,
      priceChange,
      fill: priceChange >= 0 ? '#4caf50' : '#f44336',
      volumeColor: priceChange >= 0 ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)'
    };
  });
  
  return (
    <ChartContainer elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Stock Price Chart
        </Typography>
        
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
              {stockData.map((stock) => (
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
          ${currentStock.price.toFixed(2)}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: currentStock.change >= 0 ? 'success.main' : 'error.main',
            fontWeight: 'bold',
          }}
        >
          {currentStock.change >= 0 ? '+' : ''}{currentStock.change.toFixed(2)} ({currentStock.changePercent.toFixed(2)}%)
        </Typography>
      </Box>
      
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box sx={{ height: 300, mb: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  minTickGap={15}
                  hide
                />
                <YAxis 
                  domain={[minPrice, maxPrice]} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <Bar 
                  dataKey="price" 
                  name="Price" 
                  radius={[4, 4, 0, 0]}
                  fill={(entry) => entry.fill}
                  maxBarSize={timeRange === '1W' ? 40 : timeRange === '1M' ? 20 : 10}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={processedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  minTickGap={15}
                />
                <YAxis 
                  domain={[0, maxVolume]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<VolumeTooltip />} />
                <Legend />
                <Bar 
                  dataKey="volume" 
                  name="Volume" 
                  fill={(entry) => entry.volumeColor}
                  maxBarSize={timeRange === '1W' ? 40 : timeRange === '1M' ? 20 : 10}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </ChartContainer>
  );
};

export default StockChart; 