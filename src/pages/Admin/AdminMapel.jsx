import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axiosNew from "../../components/AxiosConfig";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ToastContainer, toast } from "react-toastify";
import cryptoJS from "crypto-js";
import { JadwalModels } from "../../models/Jadwal_models";
import { useAdminMapel } from "../../store/admin/admin_mapel.store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AdminMapel() {
  const [dataPelajaran, setDataPelajaran] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [dataGuru, setDataGuru] = useState([]);
  const [dataKelas, setDataKelas] = useState([]);

  const [handlePelajaran, setHandlerPelajaran] = useState();
  const [handleGuru, setHandlerGuru] = useState();
  const [handleKelas, setHandlerKelas] = useState();
  const [handleJadwalId, setHandlerJadwalId] = useState();
  const [handleWaktu, setHandlerWaktu] = useState();

  //Zustand Store
  const mapelState = useAdminMapel((state) => state);

  async function getMapel() {
    setDataPelajaran([]);
    await axiosNew.get(`/find-pelajaran?user_id=${1}`).then((res) => {
      // console.log(res.data.data);
      setDataPelajaran(res.data.data);
      // console.log(dataPelajaran[0].nama);
    });
  }

  useEffect(() => {
    mapelState.getMapel();
  }, []);

  async function openModalApi() {
    setOpen(true);
    async function getGuruByRole() {
      await axiosNew.get("/list-user-guru").then(function (res) {
        setDataGuru(res.data.data);
      });
    }
    async function getKelas() {
      await axiosNew.get("/kelas").then(function (res) {
        setDataKelas(res.data.data);
      });
    }

    await getGuruByRole();
    await getKelas();
  }
  const token = localStorage.getItem("token");

  async function submitMapel() {
    const decrypt = cryptoJS.AES.decrypt(
      token,
      `${import.meta.env.VITE_KEY_ENCRYPT}`
    );
    let date = new Date(2022, 3, 13);
    await axiosNew
      .post(
        "/create-pelajaran",
        {
          nama: handlePelajaran,
          guruId: handleGuru,
          kelasId: handleKelas,
          jadwalId: handleJadwalId,
          jam: handleWaktu,
          createdAt: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setOpen(false);
          getMapel();
        }
      })
      .catch((err) =>
        toast.error(err.response.data.message ?? "Something went wrong")
      );
  }

  return (
    <>
      <ToastContainer />

      <Button
        onClick={openModalApi}
        style={{
          marginTop: "20px",
          marginBottom: "30px",
        }}
        variant="contained"
      >
        Tambah Mata Pelajaran
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                No
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nama Pelajaran
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nama Guru
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nomor Kelas
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Waktu
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapelState.mapel?.map((row, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {i + 1}
                  </TableCell>
                  <TableCell align="center">{row.nama}</TableCell>
                  <TableCell align="center">{row.users.nama}</TableCell>
                  <TableCell align="center">{row.kelas.kelas_id}</TableCell>
                  <TableCell align="center">{row.jam}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Tambah Pelajaran
            </Typography>
            <FormControl
              sx={{ m: 1, minWidth: 120, marginTop: 5 }}
              size="small"
            >
              <TextField
                size="small"
                id="outlined"
                label="Nama Pelajaran"
                type="text"
                onChange={(e) => setHandlerPelajaran(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                sx={{
                  height: 40,
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={handleGuru ?? 999}
                onChange={(e) => setHandlerGuru(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Guru
                </MenuItem>
                {dataGuru.map((e) => (
                  <MenuItem key={e.guru_id} value={e.guru_id}>
                    {e.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                sx={{
                  height: 40,
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={handleKelas ?? 999}
                onChange={(e) => setHandlerKelas(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Kelas
                </MenuItem>
                {dataKelas.map((e) => (
                  <MenuItem key={e.kelas_id} value={e.kelas_id}>
                    Kelas {e.nomor_kelas}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                sx={{
                  height: 40,
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={999}
                onChange={(e) => setHandlerJadwalId(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Hari
                </MenuItem>
                {JadwalModels.map((e) => (
                  <MenuItem key={e.value} value={e.value}>
                    Hari {e.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <TextField
                size="small"
                id="outlined"
                label="Jam Pelajaran"
                type="text"
                onChange={(e) => setHandlerWaktu(e.target.value)}
              />
            </FormControl>
            <Button
              style={{
                marginTop: 30,
              }}
              onClick={() => {
                mapelState.submitMapel(
                  handlePelajaran,
                  handleGuru,
                  handleKelas,
                  Number(handleJadwalId),
                  handleWaktu
                );
                console.log(handlePelajaran);
                console.log(handleGuru);
                console.log(handleKelas);
                console.log(handleJadwalId);
                console.log(handleWaktu);
              }}
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
