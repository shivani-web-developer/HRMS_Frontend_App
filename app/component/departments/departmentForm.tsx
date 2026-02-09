export default function DepartmentForm({
  isEdit,
  employees,
  department,
}: any) {
  return (
    <form className="space-y-4">
      <label htmlFor="">
        <div className="flex gap-1">
          Department Name <p className="text-red-600">*</p>
        </div>
        </label>
      <input
        className="w-full border p-2 rounded"
        placeholder="Department Name"
        required
      />
     <label htmlFor="">Description</label>
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description (optional)"
      />

      {/* Dept Head */}
       <label htmlFor="">
        <div className="flex gap-1">
          Department Head <p className="text-red-600">*</p>
        </div>
        </label>
      <select className="w-full border p-2 rounded" required>
        {employees.map((emp: any) => (
          <option key={emp.id} value={emp.id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      {/* Employees */}
       <label htmlFor="">Employees</label>
      <select
        multiple
        disabled={!isEdit}
        className="w-full border p-2 rounded"
      >
        {employees.map((emp: any) => (
          <option
            key={emp.id}
            value={emp.id}
            disabled={emp.id === department?.headId}
          >
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </select>

      <button className="bg-orange-500 text-white px-4 py-2 rounded">
        {isEdit ? 'Update Department' : 'Create Department'}
      </button>
    </form>
  );
}
