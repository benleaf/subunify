import { createContext, useReducer } from 'react'
import { Routes, BrowserRouter, Route } from 'react-router';
import { ApplicationIdleState } from './stateManagement/stateMachines/application/ApplicationIdleState';
import { reducer } from './stateManagement/stateMachines/StateMachineReducer';
import { Backdrop, CircularProgress } from '@mui/material';
import { StateMachineContext } from './stateManagement/stateMachines/StateMachineContext';
import UniversalAlert from './components/modal/UniversalAlert';
import { AuthProvider } from './contexts/AuthContext';
import LandingPageDeepStorage from './pages/LandingPageDeepStorage';
import FileUpload from './pages/FileUpload';
import DeepStorage from './pages/DeepStorage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Pricing from './pages/Pricing';
import ComedyLandingPage from './pages/comedyTest/ComedyLandingPage';
import Onboarding from './pages/Onboarding';
import AuthWrapper from './auth/AuthWrapper';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';


export const StateMachineDispatch = createContext<StateMachineContext>(undefined);

const App = () => {
  const [state, dispatch] = useReducer(reducer, new ApplicationIdleState({ machine: 'idle' }));

  return <StateMachineDispatch.Provider value={{ dispatch, state }}>
    <AuthProvider>
      <UniversalAlert />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ComedyLandingPage />} />
          <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<AuthWrapper><Payment /></AuthWrapper>} />
          <Route path="/pricing" element={<Pricing />} />
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