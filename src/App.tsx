import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './features/home/pages/HomePage';
import SignUpPage from './features/auth/pages/SignUpPage';
import SignInPage from './features/auth/pages/SignInPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import SettingsPage from './features/users/pages/SettingsPage';
import ProfilePage from './features/users/pages/ProfilePage';
import { UserProvider } from './contexts/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from "./contexts/ToastContext";
import UsersPage from './features/users/pages/UsersPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import FundraisingPage from './features/fundraising/pages/FundraisingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserDetailsPage } from './features/users/pages/UserDetailsPage';
import FundraisingListPage from './features/fundraising/pages/FundraisingListPage';
import AddFundraisingPage from './features/fundraising/pages/AddFundraisingPage';
import RulesPage from "./features/rules/pages/RulesPage";
import EditFundraisingPage from './features/fundraising/pages/EditFundraisingPage';
import ComplaintsListPage from './features/rules/pages/ComplaintsListPage';
import ComplaintDetailsPage from './features/rules/pages/ComplaintDetailsPage';
import NotFoundPage from './shared/pages/NotFoundPage';
import ReadyForReviewFundraisingsPage from './features/reviews/pages/ReadyForReviewFundraisingsPage';
import ReviewFundraisingPage from './features/reviews/pages/ReviewFundraisingPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff7654',
      // dark: '#ff5f38',
      // light: '#fe8f72',
      contrastText: '#272525',
    },
    secondary: {
      main: '#064663',
      contrastText: '#fff',
    },
    error: {
      main: '#D61F3D',
    },
    info: {
      main: '#00A7E1  ',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    background: {
      default: '#141313',
      paper: '#1E1E1E',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#ff7654',
      light: '#ff886a',
      contrastText: '#ebf2fa',
    },
    // secondary: {
    //   main: '#25a18e',
    //   contrastText: '#ebf2fa',
    // },
    // error: {
    //   main: '#D61F3D',
    // },
    // info: {
    //   main: '#00A7E1  ',
    // },
    // success: {
    //   main: '#4CAF50',
    // },
    // warning: {
    //   main: '#FF9800',
    // },
    background: {
      default: '#f0ffff',
      paper: '#e2e2e2',
    },
    text: {
      primary: '#141313',
      secondary: '#7b7b7b',
    }
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={lightTheme}>
      <ToastProvider>
        <GoogleOAuthProvider clientId="389428898545-0si1v4m7uojr1m4gfspehhvpn91120pb.apps.googleusercontent.com">
          <UserProvider>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path='/sign-in' element={<SignInPage />} />
                <Route path='/search' element={<FundraisingListPage />} />
                <Route path='/fundraising/:id' element={<FundraisingPage />} />
                <Route path='/user/:userId' element={<UserDetailsPage />} />
                <Route path='/settings' element={<SettingsPage />} />
                <Route path='/add-fundraising' element={<AddFundraisingPage />} />
                <Route path='/fundraising/:id/edit' element={<EditFundraisingPage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/reset-password' element={<ResetPasswordPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/complaints" element={<ComplaintsListPage />} />
                <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
                <Route path="/reviews" element={<ReadyForReviewFundraisingsPage />} />
                <Route path="/review/:id" element={<ReviewFundraisingPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </GoogleOAuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
