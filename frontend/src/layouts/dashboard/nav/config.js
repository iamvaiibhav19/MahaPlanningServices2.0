// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Forms',
    path: '/dashboard/forms',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Leads',
    path: '/dashboard/leads',
    icon: icon('ic_user'),
  },
];

export default navConfig;
