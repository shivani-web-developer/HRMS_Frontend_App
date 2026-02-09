'use client';

import { useState } from 'react';
import DepartmentEmployeesModal from '../component/departments/departmentEmployeeModel';
import { Avatar } from '../component/departments/Avatar';
import { AvatarGroup } from '../component/departments/AvtarGroup';
import DepartmentForm from '../component/departments/departmentForm';
import DepartmentModal from '../component/departments/departmentModel';
import { Box } from '@mui/material';
import Sidebar from '../component/layout/Sidebar';
import TopBar from '../component/layout/TopBar';
export const employees = [
  {
    id: 'EMP-001',
    firstName: 'Shivani',
    lastName: 'Yadav',
    email: 'shivani@hrms.com',
  },
  {
    id: 'EMP-002',
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit@hrms.com',
  },
  {
    id: 'EMP-003',
    firstName: 'Neha',
    lastName: 'Verma',
    email: 'neha@hrms.com',
  },
  {
    id: 'EMP-004',
    firstName: 'Rohit',
    lastName: 'Singh',
    email: 'rohit@hrms.com',
  },
  {
    id: 'EMP-005',
    firstName: 'Pooja',
    lastName: 'Mehta',
    email: 'pooja@hrms.com',
  },
  {
    id: 'EMP-006',
    firstName: 'Karan',
    lastName: 'Patel',
    email: 'karan@hrms.com',
  },
  {
    id: 'EMP-007',
    firstName: 'Anjali',
    lastName: 'Gupta',
    email: 'anjali@hrms.com',
  },
];

export const departments = [
  {
    id: 'DEP-001',
    name: 'Human Resources',
    description: 'Handles hiring, payroll and employee relations',
    headId: 'EMP-001',
    headName: 'Shivani Yadav',
    employees: [
      employees[0],
      employees[1],
      employees[2],
      employees[3],
      employees[4],
      employees[5],
    ],
  },
  {
    id: 'DEP-002',
    name: 'Engineering',
    description: 'Product development and maintenance',
    headId: 'EMP-004',
    headName: 'Rohit Singh',
    employees: [
      employees[3],
      employees[5],
      employees[6],
    ],
  },
  {
    id: 'DEP-003',
    name: 'Sales',
    description: 'Client acquisition and revenue growth',
    headId: 'EMP-002',
    headName: 'Amit Sharma',
    employees: [
      employees[1],
      employees[6],
    ],
  },
];

export default function DepartmentPage() {
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

//   return (
//   <Box>
//     <Sidebar/>
//    <Box flex={1} p={3} bgcolor="#f9fafb">
//        <TopBar title='Employees' subtitle='  Manage your employees and access their information.'/>
//      <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Departments</h2>
//         <button className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer" onClick={()=>setIsAddOpen(true)}>
//           + Add Department
//         </button>
//       </div>

//       <table className="w-full border-collapse">
//         <thead className="bg-gray-100 text-left">
//           <tr>
//             <th className="p-3">Dept ID</th>
//             <th className="p-3">Name</th>
//             <th className="p-3">Head</th>
//             <th className="p-3">Employees</th>
//             <th className="p-3">Total</th>
//             <th className="p-3">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {departments.map((dept) => (
//             <tr key={dept.id} className="border-t">
//               <td className="p-3">{dept.id}</td>
//               <td className="p-3">{dept.name}</td>

//               <td className="p-3 flex items-center gap-2">
//                 <Avatar name={dept.headName} />
//                 <span>{dept.headName}</span>
//               </td>

//               <td
//                 className="p-3 cursor-pointer"
//                 onClick={() => setSelectedDept(dept)}
//               >
//                 <AvatarGroup employees={dept.employees} />
//               </td>

//               <td className="p-3">{dept.employees.length}</td>

//               <td className="p-3 flex gap-2">
//                 <button className="text-blue-600" onClick={() => {setSelectedDept(dept); setOpenEdit(true);}}> Edit</button>
//                 <button className="text-red-600">Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selectedDept && (
//         <DepartmentEmployeesModal
//           department={selectedDept}
//           onClose={() => setSelectedDept(null)}
//         />
//       )}

//       {isAddOpen && (
//          <DepartmentModal
//            isEdit={false}
//            employees={employees}
//            onClose={() => setIsAddOpen(false)}
//           />
//        )}

//        {openEdit && selectedDept && (
//          <DepartmentModal
//             isEdit={true}
//             employees={employees}
//             department={selectedDept}
//             onClose={() => {
//             setOpenEdit(false);
//             setSelectedDept(null);
//             }}
//            />
// )}
//     </Box>
//   </Box>
//   );

  return (
  <Box display="flex" minHeight="100vh">
    <Sidebar />

    <Box flex={1} p={3} bgcolor="#f9fafb">
      <TopBar
        title="Departments"
        subtitle="Manage company departments"
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Departments</h2>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => setIsAddOpen(true)}
        >
          + Add Department
        </button>
      </div>

       <table className="w-full border-collapse">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Dept ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Head</th>
            <th className="p-3">Employees</th>
            <th className="p-3">Total</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id} className="border-t">
              <td className="p-3">{dept.id}</td>
              <td className="p-3">{dept.name}</td>

              <td className="p-3 flex items-center gap-2">
                <Avatar name={dept.headName} />
                <span>{dept.headName}</span>
              </td>

              <td
                className="p-3 cursor-pointer"
                onClick={() => setSelectedDept(dept)}
              >
                <AvatarGroup employees={dept.employees} />
              </td>

              <td className="p-3">{dept.employees.length}</td>

              <td className="p-3 flex gap-2">
                <button className="text-blue-600" onClick={() => {setSelectedDept(dept); setOpenEdit(true);}}> Edit</button>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
         {selectedDept && (
        <DepartmentEmployeesModal
          department={selectedDept}
          onClose={() => setSelectedDept(null)}
        />
      )}

      {isAddOpen && (
         <DepartmentModal
           isEdit={false}
           employees={employees}
           onClose={() => setIsAddOpen(false)}
          />
       )}

       {openEdit && selectedDept && (
         <DepartmentModal
            isEdit={true}
            employees={employees}
            department={selectedDept}
            onClose={() => {
            setOpenEdit(false);
            setSelectedDept(null);
            }}
           />
)}
  </Box>
  
);

}
