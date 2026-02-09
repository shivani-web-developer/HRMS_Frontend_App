'use client'
import { Box, Avatar, Typography, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

interface TopBarProp{
    title:string;
    subtitle:string;
}

export default function TopBar({ title, subtitle }: TopBarProp) {
  const user = useSelector((state: RootState) => state.user);
  console.log("title",title,"user=",user)
  if (!user || !user.firstName) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title={user.email || ''} arrow>
         <Avatar>{initials}</Avatar>
        </Tooltip>
         <Typography>{user.role}</Typography>
      </Box>
    </Box>
  );
}
