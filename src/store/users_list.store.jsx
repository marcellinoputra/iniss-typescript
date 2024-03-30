import {create} from "zustand"
import axiosNew from "../components/AxiosConfig"

export const useUserList = create((set) => ({
    users: [],
    isLoading: false,
    getUsers: async () => {
        set({ isLoading: true })
        await axiosNew.get("/list-users", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }).then((res) => {
            set({ users: res.data.data })
            set({ isLoading: false })
        })
    }
}))