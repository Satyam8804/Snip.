import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook"

const ProtectedRoutes =()=>{
    const {isAuthenticated} = useAppSelector((state)=>state.auth);

    return isAuthenticated?<Outlet/>:<Navigate to="/login" replace />
}

export default ProtectedRoutes;