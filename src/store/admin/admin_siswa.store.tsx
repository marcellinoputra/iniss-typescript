import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { KelasData, SiswaData } from "../../models/siswa_dao";
import { toast } from "react-toastify";

interface SiswaDto {
  nama: string;
  username: string;
  password: string;
  kelas: number
}

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
      .get("/kelas", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data)
          set({ totalPageKelas: res.data.total_page })
          set({ kelas: res.data.data });
        }
      });
  },

  fetchSiswa: async (page: number) => {
    console.log("Executed...")
    set({ siswa: [] });
    await axiosNew
      .get(`/admin/find-siswa?page=${page}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ totalPageSiswa: res.data.total_page })
          set({ siswa: res.data.data });
        }
      });
  },

  sendCreateSiswa: async (form: SiswaDto) => {
    await axiosNew
      .post(
        "/admin/create-siswa",
        {
          nama: form.nama,
          username: form.username,
          password: form.password,
          kelas_id: Number(form.kelas),
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
          get().fetchSiswa();
          get().onCloseModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  editSiswa: async (id: number, form: SiswaDto) => {
    await axiosNew
      .put(
        `/admin/edit-siswa/${id}`,
        {
          nama: form.nama,
          username: form.username,
          password: form.password,
          kelas_id: Number(form.kelas),
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
          get().fetchSiswa();
          get().closeEditModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  deleteSiswa: async (id: number) => {
    await axiosNew
      .delete(
        `/admin/delete-siswa/${id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          get().fetchSiswa();
          get().closeDeleteModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

}));
