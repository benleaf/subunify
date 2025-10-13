import { Routes, BrowserRouter, Route } from 'react-router';
import UniversalAlert from './components/modal/UniversalAlert';
import { AuthProvider } from './contexts/AuthContext';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Pricing from './pages/Pricing';
import ComedyLandingPage from './pages/comedyTest/ComedyLandingPage';
import Onboarding from './pages/Onboarding';
import AuthWrapper from './auth/AuthWrapper';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Chords from './pages/chords';

const App = () => {
  return <AuthProvider>
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
        <Route path="/chords" element={<Chords />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
}

export default App