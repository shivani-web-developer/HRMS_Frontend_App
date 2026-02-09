'use client';

import { Box } from '@mui/material';
import Sidebar from '../component/layout/Sidebar';
import TopBar from '../component/layout/TopBar';
export default function  DashboardPage() {

  return (
    <Box display="flex">
      <Sidebar />

      <Box flex={1} p={3} bgcolor="#f9fafb">
        <TopBar title='Dashboard' subtitle='Employee Management Tracking'/>

        <Box display="flex" justifyContent="flex-end" mb={2}>
        dashboard
        </Box>

      </Box>
    </Box>
  );
}
