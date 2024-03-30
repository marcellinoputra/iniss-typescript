import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";

export const usePelajaran = create((set, get) => ({
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
        // console.log(res.data.data)
        set({ pelajaran: res.data.data });
        set({ isLoading: false });
      });
  },
}));

export const useGetMapel = create((set) => ({
    
}));
