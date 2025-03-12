import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Colours } from './constants/Colours';
import App from './App';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const theme = createTheme({
  palette: {
    primary: {
      main: Colours.primary,
      light: Colours.primaryLight
    },
    secondary: {
      main: Colours.secondary
    }
  }
});

declare global {
  type TODO = any
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StrictMode>
        <App />
      </StrictMode>
    </LocalizationProvider>
  </ThemeProvider>
)