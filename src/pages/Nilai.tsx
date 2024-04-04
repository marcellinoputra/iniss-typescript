import { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNilai } from "../store/nilai.store";

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

const Nilai: React.FC = () => {
  const [handleUts, setHandleUts] = useState<string>("");
  const [handleUas, setHandleUas] = useState<string>("");
  const [handleKelasId, setHandleKelasId] = useState<number>(0);
  const [handleSemester, setHandleSemester] = useState<string>("");
  const [handlePelajaranId, setHandlePelajaranId] = useState<number>(0);
  const [handleUser, setHandlerUser] = useState<number>(0);

  //Store Zustand
  const nilaiStore = useNilai((state) => state);

  const [openManual, setOpenManual] = useState(false);
  const handleCloseManual = () => setOpenManual(false);

  async function handleOpen() {
    nilaiStore.onOpenAddModal();
    await nilaiStore.getDataKelas();
    await nilaiStore.getDataPelajaran();
    await nilaiStore.getDataUser();
  }

  useEffect(() => {
    nilaiStore.getNilai();
  }, []);

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
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nama Siswa/i
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nomor Kelas
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nilai UTS
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                }}
              >
                Nilai UAS
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                }}
              >
                Semester
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                }}
              >
                Mapel
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nilaiStore.nilai?.map((row, i) => (
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
                      onChange={(e) =>
                        setHandlePelajaranId(Number(e.target.value))
                      }
                    >
                      {nilaiStore.dataPelajaran?.map((e) => (
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
                      onChange={(e) => setHandleKelasId(Number(e.target.value))}
                    >
                      {nilaiStore.dataKelas?.map((e) => (
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
                      onChange={(e) => setHandlerUser(Number(e.target.value))}
                    >
                      {nilaiStore.dataUser?.map((e) => (
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
                    onClick={() =>
                      nilaiStore.handleSubmitNilai(
                        handleUts,
                        handleUas,
                        handleKelasId,
                        handleSemester,
                        handlePelajaranId,
                        handleUser
                      )
                    }
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
  );
};

export default Nilai;
