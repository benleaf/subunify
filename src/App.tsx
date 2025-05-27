import { createContext, useReducer } from 'react'
import { Routes, BrowserRouter, Route } from 'react-router';
import TopBar from './components/navigation/TopBar';
import { ApplicationIdleState } from './stateManagement/stateMachines/application/ApplicationIdleState';
import { reducer } from './stateManagement/stateMachines/StateMachineReducer';
import { Backdrop, CircularProgress } from '@mui/material';
import { StateMachineContext } from './stateManagement/stateMachines/StateMachineContext';
import UniversalAlert from './components/modal/UniversalAlert';
import { AuthProvider } from './auth/AuthContext';
import LandingPageDeepStorage from './pages/LandingPageDeepStorage';
import FileUpload from './pages/FileUpload';
import DeepStorage from './pages/DeepStorage';
import UserAccount from './pages/UserAccount';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Pricing from './pages/Pricing';
import ComedyLandingPage from './pages/comedyTest/ComedyLandingPage';
import Onboarding from './pages/Onboarding';


export const StateMachineDispatch = createContext<StateMachineContext>(undefined);

const App = () => {
  const [state, dispatch] = useReducer(reducer, new ApplicationIdleState({ machine: 'idle' }));

  return <StateMachineDispatch.Provider value={{ dispatch, state }}>
    <AuthProvider>
      <UniversalAlert />
      <BrowserRouter>
        {/* <TopBar /> */}
        <Routes>
          {/* <Route path="/original" element={<LandingPage />} /> */}
          <Route path="/old" element={<LandingPageDeepStorage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<ComedyLandingPage />} />
          <Route path="/file-upload" element={<FileUpload />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/deep-storage" element={<DeepStorage />} />
          {/* <Route path="/excel-importer" element={<ExcelImportPage />} /> */}
          {/* <Route path="/table-manager" element={<AuthWrapper><TableManager /></AuthWrapper>} /> */}
          {/* <Route path="/column-manager" element={<AuthWrapper><ColumnManager /></AuthWrapper>} /> */}
          {/* <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} /> */}
          {/* <Route path="/data-upload" element={<AuthWrapper><DataUpload /></AuthWrapper>} /> */}
          <Route path="/user-account" element={<UserAccount />} />
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