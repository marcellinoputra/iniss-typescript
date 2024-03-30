import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";

export const useAdminSiswa = create((set, get) => ({

  siswa: [],
  kelas: [],
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

  fetchSiswa: async (page) => {
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

  sendCreateSiswa: async (nama, username, password, kelas) => {
    await axiosNew
      .post(
        "/admin/create-siswa",
        {
          nama: nama,
          username: username,
          password: password,
          kelas_id: Number(kelas),
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

  editSiswa: async (id, nama, username, password, kelas) => {
    await axiosNew
      .put(
        `/admin/edit-siswa/${id}`,
        {
          nama: nama,
          username: username,
          password: password,
          status_user: 1,
          kelas_id: Number(kelas),
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

  deleteSiswa: async (id) => {
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
