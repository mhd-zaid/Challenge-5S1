import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import extend_theme from './utils/chakra-theme.js';
import './utils/i18n.js';
import './index.css';
import NotFoundPage from './pages/NotFoundPage.jsx';
import App from './App.jsx';
import Home from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgetPasswordPage from './pages/auth/ForgetPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EmailVerifiedPage from './pages/auth/EmailVerifiedPage.jsx';
import StudioSearchPage from './pages/StudioSearchPage.jsx';
import InfoPage from '@/pages/info/InfoPage.jsx';
import AuthGuard from './context/AuthGuard.jsx';
import StudioPage from './pages/StudioPage.jsx';
import ReservationPage from './pages/ReservationPage.jsx';
import AdminPrestataireRequests from '@/pages/admin/AdminPrestataireRequests.jsx';
import Unavailability from './pages/Unavailability.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ProfilePage from '@/pages/profile/ProfilePage.jsx';
import AdminControlCenterPage from '@/pages/admin/AdminControlCenterPage.jsx';

const theme = extendTheme(extend_theme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgetpassword" element={<ForgetPasswordPage />} />
              <Route
                path="resetpassword/:token"
                element={<ResetPasswordPage />}
              />
              <Route path="verify/:token" element={<EmailVerifiedPage />} />
            </Route>

            <Route element={<AuthGuard />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="my-absences" element={<Unavailability />} />
              <Route path="admin">
                <Route path="prestataires-demandes" element={<AdminPrestataireRequests />} />
                <Route path="control-center" element={<AdminControlCenterPage />} />
              </Route>
            </Route>

            <Route path="studios">
              <Route index element={<StudioSearchPage />} />
              <Route path=":id" element={<StudioPage />} />
              <Route
                path=":id/reservation/:service_id"
                element={<ReservationPage />}
              />
            </Route>


            <Route path="info" element={<InfoPage />} />

            <Route path="studio" element={<StudioSearchPage />} />
            <Route element={<AuthGuard />}>
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="my-absences" element={<Unavailability />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
