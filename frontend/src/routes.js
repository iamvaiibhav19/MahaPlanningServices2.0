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

import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

export default function Router() {
  const [user, setUser] = useState({});
  const { userContext } = useContext(UserContext);

  const token = localStorage.getItem('token');

  const getUser = async () => {
    //cookies
    const config = {
      withCredentials: true,
      headers: {
        token: token,
      },
    };

    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/profile`, config);
    setUser(res.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/forms" />, index: true },
        { path: 'forms', element: <DashboardAppPage /> },
        { path: 'leads', element: user?.role === 'admin' ? <AdminLeads /> : <CoordinatorLeads /> },

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
