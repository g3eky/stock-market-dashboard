# Stock Market Dashboard

A modern, interactive stock market dashboard built with React and Material-UI. This application displays real-time stock market data with various visualizations and components.

![Stock Market Dashboard](https://via.placeholder.com/800x400?text=Stock+Market+Dashboard)

## Features

- **Market Overview**: Display of major market indices with current values and performance
- **Stock Price Chart**: Interactive candlestick chart showing historical price data for selected stocks
- **Stock Search**: Search for stocks by symbol or company name
- **Watchlist**: Track your favorite stocks
- **Similar Stocks**: Find stocks in the same sector with lower P/E ratios
- **Company Metrics**: View key financial metrics for selected stocks

## Technologies Used

- React.js
- Material-UI for UI components
- ApexCharts for interactive charts
- Alpha Vantage API for real-time stock data

## API Integration

This project uses the Alpha Vantage API to fetch real-time stock data. To use the API:

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Create a `.env` file in the root directory with:
   ```
   REACT_APP_ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```
3. Restart the development server

Note: The free tier of Alpha Vantage API has limitations (5 API requests per minute, 500 per day). The application implements caching to minimize API calls.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
stock-market-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── MarketOverview.js
│   │   ├── StockChart.js
│   │   ├── SearchBar.js
│   │   ├── WatchList.js
│   │   └── SimilarStocks.js
│   ├── services/
│   │   └── stockApi.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Fallback Data

While the application primarily uses real-time data from the Alpha Vantage API, it includes fallback to simulated data in case of API rate limiting or connectivity issues.

## Customization

You can customize the dashboard by:

- Modifying the theme in `App.js`
- Adding or removing components
- Adjusting the layout in `Dashboard.js`
- Adding more stocks to the `popularStocks` array in `stockApi.js`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- ApexCharts for the charting library
- Alpha Vantage for the financial data API
- React team for the amazing framework
