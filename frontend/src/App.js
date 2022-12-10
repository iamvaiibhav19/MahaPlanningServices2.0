// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { UserProvider } from './components/Context/Context';
// const dotenv = require('dotenv');
// dotenv.config({
//   path: '../.env',
// });

// ----------------------------------------------------------------------

export default function App() {
  console.log(process.env.REACT_APP_BASE_URL, 'process.env.BASE_URL');
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
