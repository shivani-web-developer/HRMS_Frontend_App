'use client';

import { Box, Button } from '@mui/material';
import { useState } from 'react';
import Sidebar from '../component/layout/Sidebar';
import TopBar from '../component/layout/TopBar';
import EmployeeTable from '../component/employee/EmployeeTable';
import EmployeeForm from '../component/employee/AddEmployeeForm';
import { Employee, useDeleteEmployeeMutation, useGetEmployeesQuery } from '../redux/employee/employeeApi';

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // 🔥 FETCH IN PARENT
  const {
    data: employees = [],
    isLoading,
    isError,
    refetch,
  } = useGetEmployeesQuery();

  const [deleteEmployee] = useDeleteEmployeeMutation();

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete employee?`)) return;

    await deleteEmployee(id).unwrap();
    refetch(); 
  };

  return (
    <Box display="flex">
      <Sidebar />

      <Box flex={1} p={3} bgcolor="#f9fafb">
        <TopBar
          title="Employees"
          subtitle="Manage your employees and access their information."
        />

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="warning"
           onClick={() => {setSelectedEmployee(null); setOpen(true);}} >
            Add Employee
          </Button>
        </Box>

        {/* 👇 PASS DATA FROM PARENT */}
        <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        isError={isError}
        onDelete={handleDelete}
        onEdit={(emp:Employee) => {
          setSelectedEmployeeId(emp);
          setOpen(true);
        }}
      />

        {/* PASS REFETCH */}
        <EmployeeForm
         open={open}
          employeeId={selectedEmployeeId}
          onClose={() => {
            setOpen(false);
            setSelectedEmployeeId(null);
            refetch();
          }}
        />
      </Box>
    </Box>
  );
}
