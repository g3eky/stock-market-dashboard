import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { marketNews } from '../data/stockData';

const NewsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const MarketNews = () => {
  return (
    <NewsContainer elevation={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NewspaperIcon sx={{ mr: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Market News
        </Typography>
      </Box>
      
      <List>
        {marketNews.map((news, index) => (
          <React.Fragment key={news.id}>
            <ListItem 
              alignItems="flex-start"
              sx={{ 
                py: 2,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                cursor: 'pointer',
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {news.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ mb: 1 }}
                    >
                      {news.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={news.source} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          color: 'primary.main',
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {news.date}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < marketNews.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </NewsContainer>
  );
};

export default MarketNews; 