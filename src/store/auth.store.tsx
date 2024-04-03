import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";
import { toast } from "react-toastify";
import { router } from "../navigator/router";
import { LocalSeeOutlined } from "@mui/icons-material";
import { Routes } from "react-router-dom";

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

  signUpAccount: async (name: string, username: string, password: string) => {
    await axiosNew
      .post(
        "/guru/sign-up",
        {
          name: name,
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
        if (res.status === 201 || res.status === 200) {
          router.navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  signInGuru: async (username: string, password: string) => {
    await axiosNew
      .post(
        "/guru/sign-in",
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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role_id", res.data.id);
        localStorage.setItem("role", "guru");
        router.navigate("/", { replace: true });
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  signInAdmin: async (username: string, password: string) => {
    await axiosNew
      .post(
        "/admin/sign-in",
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
          localStorage.setItem("role_id", res.data.id);
          localStorage.setItem("role", "admin");
          router.navigate("/admin", { replace: true });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
