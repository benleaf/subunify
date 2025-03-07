import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { AuthProvider } from './stateManagment/auth/AuthContext';
import { Colours } from './constants/Colours';
import App from './App';

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
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  </AuthProvider>
)