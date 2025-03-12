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
import ReactApexChart from 'react-apexcharts';
import { stockData } from '../data/stockData';

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

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
          min: new Date(filteredData[0].date).getTime(),
          max: new Date(filteredData[filteredData.length - 1].date).getTime()
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
  
  return (
    <ChartContainer elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {currentStock.name} ({currentStock.symbol})
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
    </ChartContainer>
  );
};

export default StockChart; 