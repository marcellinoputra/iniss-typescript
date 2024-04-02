import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";

export const useAbsen = create((set: any, get: any) => ({
    
  absen: [],
  isLoading: false,

  removeAbsen: async () => {
    set({ absen: [] });
  },

  getAbsen: async () => {
    set({ isLoading: true });
    await axiosNew
      .get("/absen", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        set({ isLoading: false });
        if (res.status == 200) {
          set({ absen: res.data.data });
        }
      });
  },

  getAbsenFilterOrderBy: async (params: any) => {
    await axiosNew
      .get("/absen", {
        params: params,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        set({ absen: [] });
        if (res.status === 200) {
          set({ absen: res.data.data });
        }
      });
  },

  createAbsen: async (
    guru_id: number,
    pelajaran_id: number,
    kelas_id: number,
    user_id: number,
    keterangan: string,
    reason: string,
    day: number,
    month: number,
    year: number,
    time: string,
    type: string
  ) => {
    await axiosNew
      .post(
        "/absen",
        {
          guru_id: guru_id,
          pelajaran_id: pelajaran_id,
          kelas_id: kelas_id,
          user_id: user_id,
          keterangan: keterangan,
          reason: type === "IZIN" ? reason : "-",
          day: day,
          month: month,
          year: year,
          time: time,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        get().removeAbsen();
        if (res.status === 200) {
          get().getAbsen();
        }
      });
  },

  editAbsen: async (
    id: number,
    guru_id: number,
    pelajaran_id: number,
    kelas_id: number,
    user_id: number,
    keterangan: string,
    reason: string,
    day: number,
    month: number,
    year: number,
    time: string,
    type: string
  ) => {
    await axiosNew
      .put(
        `/edit-absen/${id}`,
        {
          guru_id: guru_id,
          pelajaran_id: pelajaran_id,
          kelas_id: kelas_id,
          user_id: user_id,
          keterangan: keterangan,
          reason: type === "IZIN" ? reason : "-",
          day: day,
          month: month,
          year: year,
          time: time,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        get().removeAbsen();
        if (res.status === 200) {
          get().getAbsen();
        }
      });
  },
}));
