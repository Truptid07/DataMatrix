import RegisterForm from "../components/RegisterForm";
import Logo from "../components/Logo";

function Register() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2]">
        <Logo/>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-16 lg:gap-32 mt-20">
          <RegisterForm/>
        </div>
      </div>

    </>
  );
}

export default Register;
