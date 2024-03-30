import { create } from "zustand"
import axiosNew from "../components/AxiosConfig"


export const useKelas = create((set, get) => ({
    kelas: [],
    isLoading: false,
    getDataKelas: async () => {
        set({ isLoading: true })
        await axiosNew.get("/kelas", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }).then((res) => {
            set({ kelas: res.data.data })
            set({ isLoading: false })
        })
    }
}))