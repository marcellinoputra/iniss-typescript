import { create } from "zustand"
import axiosNew from "../components/AxiosConfig"
import { toast } from 'react-toastify';

export const useAuth = create((set) => ({
    user: {},
    signInFetchAndNavigate: async (username, password, navigate) => {

        await axiosNew.post("/sign-in", {
            username: username,
            password: password
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(res => {
            if (res.status === 200) {
                localStorage.setItem("token", res.data.token)
                navigate("/")
            }
        }).catch((err) => {
            // console.log(err)
            toast.error("Username atau Password Salah!")
        })
    }

}))
