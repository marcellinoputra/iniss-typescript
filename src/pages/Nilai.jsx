import React, { useState, useEffect } from 'react'
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
import cryptoJS from "crypto-js";


const override = (React.CSSProperties = {
  transform: "translate(-50%, -50%)",
  top: "50%",
  left: "50%",
  position: "absolute",
});

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


export default function Nilai() {
  const [nilai, setDataNilai] = useState([])
  const [handleUts, setHandleUts] = useState()
  const [handleUas, setHandleUas] = useState()
  const [handleKelasId, setHandleKelasId] = useState()
  const [handleSemester, setHandleSemester] = useState()
  const [handlePelajaranId, setHandlePelajaranId] = useState()
  const [handleUser, setHandlerUser] = useState()
  // Loop
  const [dataKelas, setDataKelas] = useState([])
  const [dataUser, setDataUser] = useState([])
  const [dataPelajaran, setDataPelajaran] = useState([])


  //Trigger
  const token = localStorage.getItem("token");

  const [openManual, setOpenManual] = useState(false);
  const handleCloseManual = () => setOpenManual(false);

  async function handleOpen() {
    const decrypt = cryptoJS.AES.decrypt(
      token,
      `${import.meta.env.VITE_KEY_ENCRYPT}`
    );
    setOpenManual(true);
    await axiosNew.get("/kelas", {
      headers: {
        "x-access-token": token
      },
    }).then(function (res) {
      setDataKelas(res.data.data);
    });
    await axiosNew.get("/list-users", {
      headers: {
        "x-access-token": token
      },
    }).then(function (res) {
      setDataUser(res.data.data);
    });
    await axiosNew.get("/find-pelajaran", {
      headers: {
        "x-access-token": token
      },
    }).then(function (res) {
      setDataPelajaran(res.data.data);
    });
  }

  async function handleSubmitNilai() {
    const dataForm = {
      uts: handleUts,
      uas: handleUas,
      kelas_id: handleKelasId,
      semester: handleSemester,
      pelajaran_id: handlePelajaranId,
      user_id: handleUser,
    }

    // console.log(dataForm)
    await axiosNew.post("/create-nilai", {
      uts: handleUts,
      uas: handleUas,
      kelas_id: handleKelasId,
      semester: handleSemester,
      pelajaran_id: handlePelajaranId,
      user_id: handleUser,
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    }).then(function (res) {
      if (res.status === 200) {
        handleCloseManual();
        async function getNilai() {
          await axiosNew.get("/nilai-all").then((res) => {
            //  // console.log(res.data)
            if (res.status === 200) {
              setDataNilai(res.data.data)
            }
          })
        }
        getNilai();
      } else {
      }
    })

  }

  useEffect(() => {
    async function getNilai() {
      await axiosNew.get("/nilai-all").then((res) => {
        // console.log(res.data)
        if (res.status === 200) {
          setDataNilai(res.data.data)
        }
      })
    }
    getNilai();
  }, [])

  return (
    <>

      <div className="filter_style">
        <Button
          className="btn_absen"
          sx={{
            marginTop: 1,
          }}
          onClick={handleOpen}
          variant="contained"
        >
          Tambah Nilai
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Nama Siswa/i</TableCell>
              <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Nomor Kelas</TableCell>
              <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Nilai UTS</TableCell>
              <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Nilai UAS</TableCell>
              <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Semester</TableCell>
              <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Mapel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nilai.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell align="left">{row.nama}</TableCell>
                <TableCell align="left">{row.nomor}</TableCell>
                <TableCell align="left">{row.uts}</TableCell>
                <TableCell align="left">{row.uas}</TableCell>
                <TableCell align="left">{row.semester}</TableCell>
                <TableCell align="left">{row.nama_pelajaran}</TableCell>

              </TableRow>
            ))}

            {/* Manual Absen */}
            <Modal
              open={openManual}
              onClose={handleCloseManual}
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
                    Tambah Data Absen
                  </Typography>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Mata Pelajaran
                    </InputLabel>

                    <Select
                      sx={{
                        height: 40,
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Mata Pelajaran"
                      value={handlePelajaranId}
                      onChange={(e) => setHandlePelajaranId(e.target.value)}
                    >
                      {dataPelajaran.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.nama}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Nomor Kelas
                    </InputLabel>
                    <Select
                      sx={{
                        height: 40,
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Nomor Kelas"
                      value={handleKelasId}
                      onChange={(e) => setHandleKelasId(e.target.value)}
                    >
                      {dataKelas.map((e) => (
                        <MenuItem key={e.id} value={e.nomor}>
                          Nomor Kelas : {e.nomor}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Nama Siswa
                    </InputLabel>
                    <Select
                      sx={{
                        height: 40,
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Nomor Kelas"
                      value={handleUser}
                      onChange={(e) => setHandlerUser(e.target.value)}
                    >
                      {dataUser.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.nama}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <TextField
                      size="small"
                      id="outlined"
                      label="Nilai UTS"
                      type="text"
                      value={handleUts}
                      onChange={(e) => setHandleUts(e.target.value)}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <TextField
                      size="small"
                      id="outlined"
                      label="Nilai UAS"
                      type="text"
                      value={handleUas}
                      onChange={(e) => setHandleUas(e.target.value)}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <TextField
                      size="small"
                      id="outlined"
                      label="Semester"
                      type="text"
                      value={handleSemester}
                      onChange={(e) => setHandleSemester(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    style={{
                      marginTop: 30,
                    }}
                    onClick={handleSubmitNilai}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            </Modal>
          </TableBody>
        </Table>
      </TableContainer>

    </>
  )

}
