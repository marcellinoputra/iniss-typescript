import { create } from "zustand";
import axiosNew from "../../components/AxiosConfig";
import { toast } from "react-toastify";
import { Datum as DataKelas } from "../../models/admin_mapel/data_kelas_dto";
import { Datum as DataMapel } from "../../models/admin_mapel/data_mapel_dto";
interface DataGuruDTO {
  guru_id: number;
  nama: string;
}

let modelMapel: DataMapel[] = [];
let modelGuru: DataGuruDTO[] = [];
let modelKelas: DataKelas[] = [];

export const useAdminMapel = create((set: any) => ({
  mapel: modelMapel,
  dataGuru: modelGuru,
  dataKelas: modelKelas,
  totalPageMapel: 0,
  addModalTrigger: false,

  onOpenAddModal: async () => {
    set({ addModalTrigger: true });
  },

  onCloseAddModal: async () => {
    set({ addModalTrigger: false });
  },

  getMapel: async (page: number) => {
    set({ mapel: [] });
    await axiosNew
      .get(`/admin/find-pelajaran?page=${page}`)
      .then((res) => {
        if (res.status === 200) {
          set({ mapel: res.data.data });
          set({ totalPageMapel: res.data.total_page });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  getGuruByRole: async () => {
    await axiosNew
      .get("/list-user-guru")
      .then((res) => {
        if (res.status === 200) {
          set({ dataGuru: res.data.data });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  getKelas: async () => {
    await axiosNew
      .get("/kelas")
      .then((res) => {
        if (res.status === 200) {
          set({ dataKelas: res.data.data });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  submitMapel: async (
    nama_pelajaran: string,
    guruId: number,
    kelasId: number,
    jadwalId: number,
    jam: string
  ) => {
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
