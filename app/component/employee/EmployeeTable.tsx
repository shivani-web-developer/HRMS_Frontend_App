interface Employee {
  empId: string;
  firstName: string;
  lastName: string;
  designation?: string;
  department?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningDate: string;
}

function truncate(text: string, max = 20) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

interface Props {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: string) => void;
  onEdit: (emp: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onDelete,
  onEdit,
}: Props) {

  console.log("employee=",employees)
  return (
    <div className="overflow-x-auto bg-white rounded-md shadow">
      <table className="min-w-full border border-gray-200">
        {/* HEADER */}
        <thead className="bg-orange-500 text-sm font-semibold ">
          <tr>
            <th className="px-4 py-3 border">Emp ID</th>
            <th className="px-4 py-3 border">Employee</th>
            <th className="px-4 py-3 border">Designation</th>
            <th className="px-4 py-3 border">Department</th>
            <th className="px-4 py-3 border">Status</th>
            <th className="px-4 py-3 border">Phone Number</th>
            <th className="px-4 py-3 border">Joining Date</th>
            <th className="px-4 py-3 border text-center">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="text-sm">
          {employees.map((emp, idx) => {
            const fullName = `${emp.firstName} ${emp.lastName || ''}`;

            return (
              <tr
                key={emp.empId}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-orange-200'} 
              >
                <td className="px-4 py-3 text-center  border font-medium">
                  {emp.employeeCode}
                </td>

                <td className="px-4 py-3 text-center border">
                  <span title={fullName}>
                    {truncate(fullName)}
                  </span>
                  <main className='bg-yellow-300 text-yellow-950 rounded-xl px-2 py-1'>{emp.role}</main>
                </td>

                <td className="px-4 py-3 text-center border">
                  {emp.designation || '-'}
                </td>

                <td className="px-4 py-3 text-center  border">
                  {emp.department || '-'}
                </td>

                <td className="px-4 py-3 text-center  border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'ACTIVE'
                        ? 'bg-green-400 text-green-900'
                        : 'bg-red-400 text-red-900'
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

               <td className="px-4 py-3 text-center  border">
                  {emp.phone}
                  </td>

                <td className="px-4 py-3 text-center  border">
                  {new Date(emp.joiningDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                </td>

                <td className="px-2  py-3 border text-center space-x-1">
                  <button
                    className="hover:bg-yellow-300 rounded-2xl p-1"
                    title="Edit"
                    onClick={()=>onEdit(emp.id)}
                  >
                    ✏️
                  </button>

                  <button
                    className=" hover:bg-red-800 rounded-2xl p-1"
                    title="Delete"
                    onClick={()=> onDelete(emp.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
