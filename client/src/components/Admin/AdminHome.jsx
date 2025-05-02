import { useSelector } from "react-redux";

function AdminHome() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#2E3C43] mb-4">
        Welcome, Admin {user?.name}!
      </h1>
      <p className="text-[#546E7A]">
        This is your admin dashboard. From here, you can manage users, review uploaded files, and configure platform settings.
      </p>
    </>
  );
}

export default AdminHome;
