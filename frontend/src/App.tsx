import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { useAppDispatch } from "./store/hook";
import { useEffect, useState } from "react";
import api from "./api/axios";
import { setCredentials } from "./store/slice/authSlice";
import Footer from "./components/Footer";

function App() {
  const dispatch = useAppDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        dispatch(
          setCredentials({
            user: {
              name: res.data.name,
              email: res.data.email,
            },
            accessToken: token,
          })
        );
      } catch (error) {
        console.error(error);
        localStorage.removeItem("accessToken");
      } finally {
        setChecking(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 animate-ping" />
        <p className="text-[12px] text-gray-400">Loading...</p>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;