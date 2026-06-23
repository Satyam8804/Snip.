import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import AuthPage from "./AuthPage.tsx";
import AuthForm from "../components/forms/AuthForm.tsx";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slice/authSlice.ts";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  type AuthData = {
    email: string;
    password: string;
  };

  const handleLogin = async (data: AuthData) => {
    try {
      setLoading(true);
      const res = await login(data);

      const { name, email, accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      dispatch(setCredentials({ user: { name, email }, accessToken }));
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        onModeChange={(m) => m === "register" && navigate("/register")}
        loading={loading}
      />
    </AuthPage>
  );
};

export default Login;
