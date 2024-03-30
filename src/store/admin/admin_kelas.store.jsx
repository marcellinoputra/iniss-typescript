import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { toast } from "react-toastify";

export const useKelasAdmin = create((set, get) => ({

  kelas: [],
  guru: [],
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

  getDataKelas: async () => {
    set({ isLoading: true });
    set({ kelas: [] });
    await axiosNew
      .get(`/kelas`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ isLoading: false });
          set({ kelas: res.data.data });
        }
      });
  },

  getGuruForAdmin: async () => {
    await axiosNew
      .get("/list-user-guru", {
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

  submitKelas: async (guru_id, nomor_kelas, jumlah_orang) => {
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
          get().getDataKelas();
          get().closeAddModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  editKelas: async (id, guru_id, nomor_kelas, jumlah_orang) => {
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
          get().getDataKelas();
          get().closeEditModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  deleteKelas: async (id) => {
    await axiosNew
      .delete(`/admin/delete-kelas/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          get().getDataKelas();
          get().closeDeleteModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
