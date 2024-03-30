import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { toast } from "react-toastify";

export const useAdminMapel = create((set, get) => ({
  mapel: [],
  addModalTrigger: false,

  getMapel: async () => {
    set({ mapel: [] });
    await axiosNew.get(`/find-pelajaran?user_id=${1}`).then((res) => {
      if (res.status === 200) {
        set({ mapel: res.data.data });
      }
    });
  },
  submitMapel: async (nama_pelajaran, guruId, kelasId, jadwalId, jam) => {
    await axiosNew
      .post(
        "/admin/create-pelajaran",
        {
          nama: nama_pelajaran,
          guruId: guruId,
          kelasId: kelasId,
          jadwal: jadwalId,
          jam: jam,
          createdAt: new Date().toISOString(),
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
}));
