import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { useAppDispatch } from "./store/hook";
import { useEffect } from "react";
import api from "./api/axios";
import { setCredentials } from "./store/slice/authSlice";
import Footer from "./components/Footer";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

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
      }
    };

    restoreSession();
  }, [dispatch]);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
