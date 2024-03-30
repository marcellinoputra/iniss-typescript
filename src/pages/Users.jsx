import React, { useState,useEffect } from 'react'
import {
   Box,
   Table,
   TableCell,
   TableContainer,
   TableHead,
   Paper,
   TableRow,
   TableBody,
   Button,
   Modal,
   TextField,
   FormControl,
   Typography,
   InputLabel,
   Select,
   MenuItem,
   Chip,
   InputAdornment,
 } from "@mui/material";
 import axiosNew from "../components/AxiosConfig";

export default function Users() {
   const [users, setDataUsers] = useState([])
   const [dataKelas, setDataKelas] = useState([])
   const [namaAdd, setNama] = useState()
   const [usernameAdd,setUsername] = useState()
   const [passwordAdd,setPassword] = useState()
   const [kelasAdd, setKelas] = useState()

   useEffect(() => {
      async function getUser() {
         await axiosNew.get("/siswa-users").then((res) => {
            setDataUsers(res.data.data)
         })
      }

       getUser()

   }, [])



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
                  {users.map((row,i) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:lastchild th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {i+1}
                        </TableCell>
                        <TableCell align="left">{row.nama}</TableCell>
                        <TableCell align="left">{row.notelp}</TableCell>
                        <TableCell align="left">
                           {row.nomor}
                        </TableCell>
                        <TableCell align="left">{row.wali}</TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

          </>
   </>
  )
}

