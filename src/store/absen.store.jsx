import { create } from "zustand"
import axiosNew from "../components/AxiosConfig"

export const useAbsen = create((set, get) => ({
    absen: [],
    isLoading: false,
    removeAbsen: async () => {
        set({ absen: [] })
    },
    getAbsen: async () => {
        set({ isLoading: true })
        await axiosNew.get("/absen", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }).then((res) => {
            
            set({ isLoading: false })
            if(res.status == 200)  {
                set({ absen: res.data.data })
            }
        })
    },
    getAbsenFilterOrderBy: async (params) => {
        await axiosNew.get("/absen", {
            params: params,
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }).then((res) => {
            set({ absen: []})
            if(res.status === 200) {
                set({ absen: res.data.data })
            }
        })
    },
    createAbsen: async (guru_id, pelajaran_id, kelas_id, user_id, keterangan, reason, day, month, year, time, type) => {
        await axiosNew.post("/absen", {
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
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": localStorage.getItem("token")
            }
        }).then((res) => {
            removeAbsen()
            if (res.status === 200) {
                getAbsen()
            }

        })
    },
    editAbsen: async (formData,id) => {
        await axiosNew.put(`/edit-absen/${id}`, {
            guru_id: formData.guru_id,
            pelajaran_id: formData.pelajaran_id,
            kelas_id: formData.kelas_id,
            user_id:formData. user_id,
            keterangan: keterangan,
            reason: type === "IZIN" ? formData.reason : "-",
            day: formData.day,
            month: formData.month,
            year: formData.year,
            time: formData.time,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": localStorage.getItem("token")
            }
        }).then((res) => {
            removeAbsen()
            if (res.status === 200) {
                getAbsen()
            }
        })
    },
    }
))