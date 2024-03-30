import axiosNew from "../components/AxiosConfig";

export function FetchHasilUlangan() {
    const userId = localStorage.getItem("role_id")

    return axiosNew.get(`/all-exam?user_id=${userId}`);
}

export function FetchHasilUlanganById(id) {
    return axiosNew.get(`/ujian-detail/${id}`);
}
