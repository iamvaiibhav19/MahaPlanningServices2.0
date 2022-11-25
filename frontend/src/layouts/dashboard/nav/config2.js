// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig2 = [
  {
    title: 'New Leads',
    path: '/dashboard/new',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Payment Pending',
    path: '/dashboard/pendingPayments',
    icon: icon('ic_user'),
  },
  {
    title: 'Payment Done',
    path: '/dashboard/donePayments',
    icon: icon('ic_user'),
  },
];

export default navConfig2;
