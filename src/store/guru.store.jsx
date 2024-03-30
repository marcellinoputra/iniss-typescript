import {create} from "zustand"
import axiosNew from "../components/AxiosConfig"

export const useGuru = create((set) => ({
    guru: [],
    isLoading: false,
    getDataGuru: async () => {
        set({ isLoading: true })
        await axiosNew.get("/guru", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }).then((res) => {
            set({ guru: res.data.data })
            set({ isLoading: false })
        })
    },
    getDataGuruFilterOrderBy: async (params) => {
        set({ isLoading: true })
        set({ guru: [] })
        await axiosNew.get("/guru", {
            params: params,
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }).then((res) => {
            
            if(res.status === 200) {
                set({ guru: res.data.data })
            }
        })
    }
}))