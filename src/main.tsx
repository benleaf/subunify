import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { Routes, BrowserRouter, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import ExcelImportPage from './pages/ExcelImportPage';
import Dashboard from './pages/Dashboard';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import TopBar from './components/navigation/TopBar';
import { AuthProvider } from './stateManagment/auth/AuthContext';
import { Colours } from './constants/Colours';

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
        <TopBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/excel-importer" element={<ExcelImportPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>
    </ThemeProvider>
  </AuthProvider>
)