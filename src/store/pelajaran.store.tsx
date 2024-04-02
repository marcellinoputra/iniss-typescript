import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";

export const usePelajaran = create((set: any, get: any) => ({

  pelajaran: [],
  isLoading: false,

  getPelajaran: async () => {
    set({ isLoading: true });
    await axiosNew
      .get("/kelas", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        set({ pelajaran: res.data.data });
        set({ isLoading: false });
      });
  },
}));

export const useGetMapel = create((set) => ({
    
}));
