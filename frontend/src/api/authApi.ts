import api from "./axios";


export interface LoginResponse {
    message: string;
    data: {
        name: string;
        email: string;
        accessToken: string;
    };
}

export const login = (data: {email:string;password:string}) => {
  return api.post<LoginResponse>("/auth/login", data);
};

export const register = (data: object) => {
  return api.post("/auth/register", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};
