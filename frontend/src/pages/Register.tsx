import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import AuthPage from "./AuthPage.tsx";
import AuthForm from "../components/forms/AuthForm.tsx";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  type AuthData = {
    name?: string;
    email: string;
    password: string;
  };

  const handleRegister = async (data: AuthData) => {
    try {
      setLoading(true);
      await register(data);
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        onModeChange={(m) => m === "login" && navigate("/login")}
        loading={loading}
      />
    </AuthPage>
  );
};

export default Register;
