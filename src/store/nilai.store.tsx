import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";
import { toast } from "react-toastify";

interface NilaiDTO {
  nama: string;
  nomor: number;
  uts: number;
  uas: number;
  semester: number;
  nama_pelajaran: string;
}

interface DataKelasDTO {
  id: number;
  nomor: number;
}

interface DataUserDTO {
  id: number;
  nama: string;
}

interface DataPelajaran {
  id: number;
  nama: string;
}

let modelNilai: NilaiDTO[] = [];
let modelDataKelas: DataKelasDTO[] = [];
let modelDataUser: DataUserDTO[] = [];
let modelDataPelajaran: DataPelajaran[] = [];

export const useNilai = create((set: any, get: any) => ({
  nilai: modelNilai,
  addModalTrigger: false,
  dataKelas: modelDataKelas,
  dataUser: modelDataUser,
  dataPelajaran: modelDataPelajaran,

  onOpenAddModal: async () => {
    set({ addModalTrigger: true });
  },
  onCloseAddModal: async () => {
    set({ addModalTrigger: false });
  },

  getNilai: async () => {
    set({ nilai: [] });
    await axiosNew
      .post("/nilai-all")
      .then((res) => {
        if (res.status === 200) {
          set({ nilai: res.data.data });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  handleSubmitNilai: async (
    uts: string,
    uas: string,
    kelas_id: number,
    semester: string,
    pelajaran_id: number,
    user_id: number
  ) => {
    await axiosNew
      .post(
        "/create-nilai",
        {
          uts: uts,
          uas: uas,
          kelas_id: kelas_id,
          semester: semester,
          pelajaran_id: pelajaran_id,
          user_id: user_id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          get().onCloseAddModal();
          get().getNilai();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  getDataKelas: async () => {
    set({ dataKelas: [] });
    await axiosNew
      .get("/kelas", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ dataKelas: res.data.data });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  getDataUser: async () => {
    set({ dataUser: [] });
    await axiosNew
      .get("/list-users", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ dataUser: res.data.data });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },

  getDataPelajaran: async () => {
    set({ dataPelajaran: [] });
    await axiosNew
      .get("/find-pelajaran", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ dataPelajaran: res.data.data });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "Something Went Wrong");
      });
  },
}));
