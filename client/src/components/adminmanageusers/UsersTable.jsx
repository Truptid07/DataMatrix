import UserRow from "./UserRow";

export default function UsersTable({ users, ...props }) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <table className="w-full bg-white">
        <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-700 font-semibold">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">No users found.</td>
            </tr>
          ) : (
            users.map((u) => (
              <UserRow key={u._id} u={u} {...props} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
