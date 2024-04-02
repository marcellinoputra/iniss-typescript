import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { KelasData, SiswaData } from "../../models/siswa_dao";
import { toast } from "react-toastify";


let modelSiswa: SiswaData[] = [];
let modelKelas: KelasData[] = [];

export const useAdminSiswa = create((set: any, get: any) => ({
  siswa: modelSiswa,
  kelas: modelKelas,
  totalPageSiswa: 0,
  totalPageKelas: 0,
  addModalTrigger: false,
  editModalTrigger: false,
  deleteModalTrigger: false,

  onOpenModal: async () => {
    set({ addModalTrigger: true });
  },
  onCloseModal: async () => {
    set({ addModalTrigger: false });
  },

  openEditModal: async () => {
    set({ editModalTrigger: true });
  },
  closeEditModal: async () => {
    set({ editModalTrigger: false });
  },

  openDeleteModal: async () => {
    set({ deleteModalTrigger: true });
  },
  closeDeleteModal: async () => {
    set({ deleteModalTrigger: false });
  },

  fetchKelas: async () => {
    set({ kelas: [] });
    await axiosNew
      .get("/kelas?limit=999", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ totalPageKelas: res.data.total_page });
          set({ kelas: res.data.data });
        }
      });
  },

  fetchSiswa: async (page: number) => {
    set({ siswa: [] });
    await axiosNew
      .get(`/admin/find-siswa?page=${page}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ totalPageSiswa: res.data.total_page });
          set({ siswa: res.data.data });
        }
      });
  },

  sendCreateSiswa: async (
    nama: string,
    username: string,
    password: string,
    kelas_id: number
  ) => {
    await axiosNew
      .post(
        "/admin/create-siswa",
        {
          nama: nama,
          username: username,
          password: password,
          kelasid: kelas_id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          get().fetchSiswa(1);
          get().onCloseModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  editSiswa: async (
    id: number,
    nama: string,
    username: string,
    kelas: number
  ) => {
    await axiosNew
      .put(
        `/admin/edit-siswa/${id}`,
        {
          nama: nama,
          username: username,
          kelas_id: Number(kelas),
          status_user: 1,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          get().fetchSiswa(1);
          get().closeEditModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  deleteSiswa: async (id: number) => {
    await axiosNew
      .delete(`/admin/delete-siswa/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          get().fetchSiswa(1);
          get().closeDeleteModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
