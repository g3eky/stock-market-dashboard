import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { sectorPerformance } from '../data/stockData';

const SectorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, boxShadow: 3 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: payload[0].value >= 0 ? 'success.main' : 'error.main',
            fontWeight: 'bold',
          }}
        >
          {payload[0].value >= 0 ? '+' : ''}{payload[0].value.toFixed(2)}%
        </Typography>
      </Paper>
    );
  }

  return null;
};

const SectorPerformance = () => {
  // Sort sectors by performance
  const sortedSectors = [...sectorPerformance].sort((a, b) => b.change - a.change);
  
  return (
    <SectorContainer elevation={3}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Sector Performance
      </Typography>
      
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedSectors}
            margin={{
              top: 5,
              right: 30,
              left: 100,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`}
              domain={[-2, 2]}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="change" 
              fill={(data) => data.change >= 0 ? '#4caf50' : '#f44336'}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </SectorContainer>
  );
};

export default SectorPerformance; 