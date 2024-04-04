import { useState, useEffect } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  TableBody,
} from "@mui/material";
import axiosNew from "../components/AxiosConfig";

interface DataUser {
  id: number;
  nama: string;
  notelp: number;
  nomor: number;
  wali: string;
}

export default function Users() {
  const [users, setDataUsers] = useState<DataUser[]>([]);

  useEffect(() => {
    async function getUser() {
      await axiosNew.get("/siswa-users").then((res) => {
        setDataUsers(res.data.data);
      });
    }

    getUser();
  }, []);

  return (
    <>
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>No Telp</TableCell>
                <TableCell>Nomor Kelas</TableCell>
                <TableCell>Wali Kelas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, i) => {
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:lastchild th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {i + 1}
                    </TableCell>
                    <TableCell align="left">{row.nama}</TableCell>
                    <TableCell align="left">{row.notelp}</TableCell>
                    <TableCell align="left">{row.nomor}</TableCell>
                    <TableCell align="left">{row.wali}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </>
  );
}
