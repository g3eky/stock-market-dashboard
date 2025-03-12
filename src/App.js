import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Grid, Box } from '@mui/material';
import Header from './components/Header';
import MarketOverview from './components/MarketOverview';
import StockChart from './components/StockChart';
import TopMovers from './components/TopMovers';
import SectorPerformance from './components/SectorPerformance';
import MarketNews from './components/MarketNews';

// Note: To use the Alpha Vantage API, you need to get an API key from:
// https://www.alphavantage.co/support/#api-key
// Then create a .env file in the root directory with:
// REACT_APP_ALPHA_VANTAGE_API_KEY=your_api_key_here

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <MarketOverview />
          
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <StockChart />
            </Grid>
            <Grid item xs={12} lg={4}>
              <SectorPerformance />
            </Grid>
          </Grid>
          
          <TopMovers />
          
          <MarketNews />
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center' }}>
              <Box component="p" sx={{ mb: 1 }}>
                StockVision Dashboard - Demo Application
              </Box>
              <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                © {new Date().getFullYear()} StockVision. All data is simulated for demonstration purposes.
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
