import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import 'react-multi-carousel/lib/styles.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Colours } from './constants/Colours';
import App from './App';
import { UploadProvider } from './contexts/UploadContext';

const theme = createTheme({
  palette: {
    background: {
      default: Colours.white,
      paper: Colours.white,
    },
    common: {
      black: Colours.black,
      white: Colours.white,
    },
    primary: {
      main: Colours.primary,
      light: Colours.primaryLight,
      dark: Colours.primaryDark
    },
    secondary: {
      main: Colours.secondary
    },
  },
});

declare global {
  type TODO = any
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <UploadProvider>
      <CssBaseline enableColorScheme />
      <StrictMode>
        <App />
      </StrictMode>
    </UploadProvider>
  </ThemeProvider>
)