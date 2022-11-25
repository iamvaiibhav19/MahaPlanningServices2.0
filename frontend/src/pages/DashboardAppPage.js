import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, CssBaseline, Box, Paper } from '@mui/material';
import LinearStepper from '../components/Stepper/LinearStepper';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Forms | Maha Planning Services </title>
      </Helmet>

      <Container
        sx={{
          width: '100%',
          //give box shadow to the container
        }}
      >
        <Typography variant="h4" sx={{ mb: 5 }}>
          Forms
        </Typography>
        <Container
          sx={{
            minWidth: '800',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid #e0e0e0',
          }}
        >
          <CssBaseline />
          <Container component={Box} p={4}>
            <Paper component={Box} p={3}>
              <LinearStepper />
            </Paper>
          </Container>
        </Container>
      </Container>
    </>
  );
}
