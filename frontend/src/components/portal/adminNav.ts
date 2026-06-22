import { NavItem } from './PortalShell';

// Admin sidebar. Attendance/Marks/Timetable/Notes oversight + audit log arrive
// with the Phase 3 feature modules.
export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'ChartBarIcon' },
  { label: 'Faculty', href: '/admin/faculty', icon: 'AcademicCapIcon' },
  { label: 'Students', href: '/admin/students', icon: 'UserGroupIcon' },
  { label: 'Classes', href: '/admin/classes', icon: 'BookOpenIcon' },
  { label: 'Timetable', href: '/admin/timetable', icon: 'CalendarDaysIcon' },
  { label: 'Audit Log', href: '/admin/audit', icon: 'DocumentTextIcon' },
];
