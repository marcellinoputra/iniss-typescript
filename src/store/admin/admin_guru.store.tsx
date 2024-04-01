import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { toast } from "react-toastify";

interface AdminGuruDTO {
  guru_id: number;
  nama: string;
  username: string;
  status_user: number;
  user_agent: string;
}

let modelGuru: AdminGuruDTO[] = [];

export const useAdminGuru = create((set: any, get: any) => ({
  guru: modelGuru,
  isLoading: false,
  totalPageGuru: 0,
  addModalTrigger: false,
  editModalTrigger: false,
  deleteModalTrigger: false,
  showPasswordTrigger: false,
  dataPasswordTrigger: null,

  onOpenAddModal: async () => {
    set({ addModalTrigger: true });
  },
  onCloseAddModal: async () => {
    set({ addModalTrigger: false });
  },

  onOpenEditModal: async () => {
    set({ editModalTrigger: true });
  },
  onCloseEditModal: async () => {
    set({ editModalTrigger: false });
  },

  onShowPassword: async () => {
    set({ showPasswordTrigger: true });
  },
  onHidePassword: async () => {
    set({ showPasswordTrigger: false });
  },

  onOpenDeleteModal: async () => {
    set({ deleteModalTrigger: true });
  },
  onCloseDeleteModal: async () => {
    set({ deleteModalTrigger: false });
  },

  getGuru: async (page: number) => {
    set({ guru: [] });
    await axiosNew
      .get(`/admin/find-guru?page=${page}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ guru: res.data.data });
          set({ totalPageGuru: res.data.total_page });
          set({ isLoading: false });
        }
      });
  },
  createGuru: async (
    nama: string,
    username: string,
    password: string
    // user_agent: string
  ) => {
    await axiosNew
      .post(
        "/admin/create-guru",
        {
          nama: nama,
          username: username,
          password: password,
          // user_agent: user_agent,
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
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
  updateGuru: async (
    id: number,
    nama: string,
    username: string,
    status_user: number
  ) => {
    await axiosNew
      .put(
        `/admin/edit-guru/${id}`,
        {
          nama: nama,
          username: username,
          status_user: status_user,
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
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
  deleteGuru: async (id: number) => {
    await axiosNew
      .delete(`/admin/delete-guru/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
