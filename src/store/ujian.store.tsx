import { create } from "zustand";
import axiosNew from "../components/AxiosConfig";
import { toast } from "react-toastify";
import { KelasData } from "../models/ujian_models";


let modelKelas: KelasData[] = [];

export const useKelas = create((set: any) => ({

  kelas: modelKelas,

  fetchKelas: async () => {
    const userId = localStorage.getItem("role_id");
    if (userId === undefined || userId === null) {
      toast.error("Id Guru tidak ditemukan");
    } else {
      // console.log("UserId: ", userId)
      await axiosNew.get(`/kelas?user_id=${userId}`).then((res) => {
        // console.log("Kelas: ", res.data.data)
        set({ kelas: res.data.data });
      });
    }
  },

  // getUjian: async () =>{
  //   setAnswerUser([]);
  //   if (
  //     localStorage.getItem("role_id") !== undefined &&
  //     filterTipeUjian === "Semua"
  //   ) {
  //     await axiosNew
  //       .get("/all-ujian?guru_id=" + localStorage.getItem("role_id"), {})
  //       .then((res) => {
  //         setDataUjian(res.data.data);
  //         setHideModalTrigger(false);
  //       })
  //       .catch((err) => {
  //         toast.error(err.response.data.message ?? "Something Went Wrong")
  //       });
  //   } else if (
  //     localStorage.getItem("role_id") !== undefined ||
  //     (localStorage.getItem("role_id") !== null && filterTipeUjian !== "Semua")
  //   ) {
  //     await axiosNew
  //       .get(
  //         "/all-ujian?guru_id=" +
  //         localStorage.getItem("role_id") +
  //         "&nama_ujian=" +
  //         filterTipeUjian,
  //         {}
  //       )
  //       .then((res) => {
  //         setDataUjian(res.data.data);
  //         setHideModalTrigger(false);
  //       })
  //       .catch((err) => {
  //         toast.error(err.response.data.message ?? "Something Went Wrong")
  //       });
  //   }
  // }
}));

// export const useUjian = create((set) => ({
//     ujian: [],
//     isLoading: false,
//     getUjian: async () => {
//         set({ isLoading: true })
//         await axiosNew.get("/all-ujian", {

//         }).then((res) => {
//             set({ ujian: res.data.data })
//             set({ isLoading: false })
//         })
//     }
// }))
