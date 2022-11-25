// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { UserProvider } from './components/Context/Context';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <ScrollToTop />
        <StyledChart />
        <Router />
      </ThemeProvider>
    </UserProvider>
  );
}
