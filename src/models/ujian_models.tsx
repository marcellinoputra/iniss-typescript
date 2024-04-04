// Kelas DAO
export interface KelasModels {
    status: number
    error: boolean
    data: KelasData[]
    total_page: number
    total_result: number
    limit: number
    message: string
}

export interface KelasData {
    jumlah_orang: number
    guru_id: number
    kelas_id: number
    nomor_kelas: string
    guru_users: GuruUsers
}

export interface GuruUsers {
    nama: string
}