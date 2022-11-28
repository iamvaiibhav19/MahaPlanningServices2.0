import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import CoordinatorLeads from './pages/CoordinatorLeads';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import NewLeads from './pages/NewLeads';
import PaymentPending from './pages/PaymentPending';
import PaymentDone from './pages/PaymentDone';
import Coordinators from './pages/Coordinators';
import AdminLeads from './pages/AdminLeads';
import UserContext from './components/Context/Context';

import { useContext } from 'react';

export default function Router() {
  const { UserContext } = useContext(UserContext);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/forms" />, index: true },
        { path: 'forms', element: <DashboardAppPage /> },
        { path: 'leads', element: UserContext?.role === 'admin' ? <AdminLeads /> : <CoordinatorLeads /> },

        { path: 'new', element: <NewLeads /> },
        { path: 'donePayments', element: <PaymentDone /> },
        { path: 'pendingPayments', element: <PaymentPending /> },
        { path: 'coordinators', element: <Coordinators /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        {
          element: <Navigate to={`${localStorage.getItem('token') === null ? '/login' : '/dashboard/forms'}`} />,
          index: true,
        },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
