'use client';

import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard,
  People,
  AccessTime,
  Business,
  Work,
  Settings,
  Logout
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const menu = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Employees', icon: <People />, path: '/employee' },
  { label: 'MY Attendance', icon: <AccessTime />, path: '/myAttendance' },
  { label: 'All Attendance', icon: <AccessTime />, path: '/allAttendance' },
  { label: 'Departments', icon: <Business />, path: '/department' },
  { label: 'Designations', icon: <Work />, path: '/designations' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/auth');
  };

  return (
    <Box width={240} bgcolor="#fff" height="100vh" boxShadow={1} position="relative">
      <Box p={2} fontWeight={700} color="orange" fontSize={22}>
        HRMS
      </Box>

      <List>
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => router.push(item.path)}
              sx={{
                bgcolor: active ? '#FFF3E0' : 'transparent',
                color: active ? 'orange' : 'inherit'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <List sx={{ position: 'absolute', bottom: 20, width: '100%' }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
}
