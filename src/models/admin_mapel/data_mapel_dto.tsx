export interface DataMapel {
  status: number;
  error: boolean;
  data: Datum[];
  total_page: number;
  total_result: number;
  limit: number;
  message: string;
}

export interface Datum {
  nama: string;
  guru_id: number;
  kelas_id: number;
  jadwal: number;
  jam: string;
  createdAt: Date;
  updatedAt: null;
  pelajaran_id: number;
  users: Users;
  kelas: Kelas;
}

export interface Kelas {
  kelas_id: number;
  nomor_kelas: string;
}

export interface Users {
  nama: string;
  guru_id: number;
}
