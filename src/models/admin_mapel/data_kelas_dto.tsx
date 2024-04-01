export interface DataKelasDTO {
  status: number;
  error: boolean;
  data: Datum[];
  total_page: number;
  total_result: number;
  limit: number;
  message: string;
}

export interface Datum {
  jumlah_orang: number;
  guru_id: number;
  kelas_id: number;
  nomor_kelas: string;
  guru_users: GuruUsers;
}

export interface GuruUsers {
  nama: string;
}
