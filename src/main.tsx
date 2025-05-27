import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, CssBaseline } from '@mui/material';
import type { } from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider } from '@emotion/react';
import { Colours } from './constants/Colours';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LicenseInfo } from '@mui/x-license';
import App from './App';

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_KEY);

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
      main: Colours.primaryDark,
      light: Colours.primaryLight
    },
    secondary: {
      main: Colours.secondary
    },
  },
  mixins: {
    MuiDataGrid: {
      pinnedBackground: Colours.lightGrey,
      containerBackground: Colours.lightGrey,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: Colours.lightGrey,
        },
        body: {
          backgroundColor: Colours.darkGrey,
        },
      }
    }
  }
});

declare global {
  type TODO = any
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline enableColorScheme />
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StrictMode>
        <App />
      </StrictMode>
    </LocalizationProvider>
  </ThemeProvider>
)