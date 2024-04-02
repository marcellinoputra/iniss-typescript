import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";
import { toast } from "react-toastify";

export const useAuth = create((set: any, get: any) => ({

  user: {},

  signInFetchAndNavigate: async (
    username: string,
    password: string,
    navigate: any
  ) => {
    await axiosNew
      .post(
        "/sign-in",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
