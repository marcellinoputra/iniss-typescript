import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { toast } from "react-toastify";
import { KelasData, GuruData } from "../../models/kelas_dao";


let modelKelas: KelasData[] = [];
let modelGuru: GuruData[] = [];

export const useKelasAdmin = create((set: any, get: any) => ({

  kelas: modelKelas,
  guru: modelGuru,
  totalPageKelas: 0,
  isLoading: false,
  addModalTrigger: false,
  editModalTrigger: false,
  deleteModalTrigger: false,

  openAddModal: async () => {
    set({ addModalTrigger: true });
  },
  closeAddModal: async () => {
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

  getDataKelas: async (page: number) => {
    set({ isLoading: true });
    set({ kelas: [] });
    await axiosNew
      .get(`/kelas?page=${page}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ isLoading: false });
          set({ kelas: res.data.data });
          set({ totalPageKelas: res.data.total_page })
        }
      });
  },

  getGuruForAdmin: async () => {
    await axiosNew
      .get("/list-user-guru?limit=999", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ guru: res.data.data });
        }
      });
  },

  submitKelas: async (
    guru_id: number,
    nomor_kelas: string,
    jumlah_orang: number
  ) => {
    set({ isLoading: true });
    await axiosNew
      .post(
        "/admin/create-kelas",
        {
          guru_id: guru_id,
          nomor_kelas: nomor_kelas,
          jumlah_orang: jumlah_orang,
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
          get().getDataKelas(1);
          get().closeAddModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  editKelas: async (
    id: number,
    guru_id: number,
    nomor_kelas: string,
    jumlah_orang: number
  ) => {
    set({ isLoading: true });
    await axiosNew
      .put(
        `/admin/edit-kelas/${id}`,
        {
          guru_id: guru_id,
          nomor_kelas: nomor_kelas,
          jumlah_orang: Number(jumlah_orang),
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
          get().getDataKelas(1);
          get().closeEditModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  deleteKelas: async (id: number) => {
    await axiosNew
      .delete(`/admin/delete-kelas/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          get().getDataKelas(1);
          get().closeDeleteModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
