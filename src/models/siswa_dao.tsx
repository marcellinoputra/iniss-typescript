// Siswa DAO
export interface SiswaModels {
    status: number
    error: boolean
    data: SiswaData[]
    total_page: number
    total_result: number
    limit: number
    skip: number
    message: string
}

export interface SiswaData {
    siswa_id: number
    nama: string
    username: string
    password: string
    kelas_id: number
    status_user: number
    kelas: Kelas
}

export interface Kelas {
    nomor_kelas: string
}

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
