import { createContext, Dispatch, useReducer } from 'react'
import { Routes, BrowserRouter, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import ExcelImportPage from './pages/ExcelImportPage';
import Dashboard from './pages/Dashboard';
import TopBar from './components/navigation/TopBar';
import { ApplicationIdelState } from './stateManagment/stateMachines/application/ApplicationIdleState';
import { reducer } from './stateManagment/stateMachines/StateMachineReducer';
import { Backdrop, CircularProgress } from '@mui/material';
import { StateMachineContext } from './stateManagment/stateMachines/StateMachineContext';
import DataUpload from './pages/DataUpload';
import UniversalAlert from './components/modal/UniversalAlert';


export const StateMachineDispatch = createContext<StateMachineContext>(undefined);

const App = () => {
  const [state, dispatch] = useReducer(reducer, new ApplicationIdelState({ machine: 'idle' }));

  return <StateMachineDispatch.Provider value={{ dispatch, state }}>
    <UniversalAlert />
    <TopBar />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/excel-importer" element={<ExcelImportPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data-upload" element={<DataUpload />} />
      </Routes>
    </BrowserRouter>
    <Backdrop
      sx={{ color: '#fff', zIndex: Number.MAX_SAFE_INTEGER }}
      open={!!state.data.loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  </StateMachineDispatch.Provider>
}

export default App