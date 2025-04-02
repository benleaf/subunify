import { createContext, useReducer } from 'react'
import { Routes, BrowserRouter, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import ExcelImportPage from './pages/ExcelImportPage';
import Dashboard from './pages/Dashboard';
import TopBar from './components/navigation/TopBar';
import { ApplicationIdleState } from './stateManagement/stateMachines/application/ApplicationIdleState';
import { reducer } from './stateManagement/stateMachines/StateMachineReducer';
import { Backdrop, CircularProgress } from '@mui/material';
import { StateMachineContext } from './stateManagement/stateMachines/StateMachineContext';
import DataUpload from './pages/DataUpload';
import UniversalAlert from './components/modal/UniversalAlert';
import TableManager from './pages/TableManager';
import { AuthProvider } from './auth/AuthContext';
import AuthWrapper from './auth/AuthWrapper';
import ColumnManager from './pages/ColumnManager';
import LandingPageDeepStorage from './pages/LandingPageDeepStorage';
import FileUpload from './pages/FileUpload';
import DeepStorage from './pages/DeepStorage';


export const StateMachineDispatch = createContext<StateMachineContext>(undefined);

const App = () => {
  const [state, dispatch] = useReducer(reducer, new ApplicationIdleState({ machine: 'idle' }));

  return <StateMachineDispatch.Provider value={{ dispatch, state }}>
    <AuthProvider>
      <UniversalAlert />
      <TopBar />
      <BrowserRouter>
        <Routes>
          <Route path="/original" element={<LandingPage />} />
          <Route path="/" element={<LandingPageDeepStorage />} />
          <Route path="/file-upload" element={<FileUpload />} />
          <Route path="/deep-storage" element={<AuthWrapper><DeepStorage /></AuthWrapper>} />
          <Route path="/excel-importer" element={<ExcelImportPage />} />
          <Route path="/table-manager" element={<AuthWrapper><TableManager /></AuthWrapper>} />
          <Route path="/column-manager" element={<AuthWrapper><ColumnManager /></AuthWrapper>} />
          <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
          <Route path="/data-upload" element={<AuthWrapper><DataUpload /></AuthWrapper>} />
        </Routes>
      </BrowserRouter>
      <Backdrop
        sx={{ color: '#fff', zIndex: Number.MAX_SAFE_INTEGER }}
        open={!!state.data.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </AuthProvider>
  </StateMachineDispatch.Provider>
}

export default App