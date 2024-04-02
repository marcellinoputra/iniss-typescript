import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
import { ToastContainer } from "react-toastify";
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

const AdminMapel: React.FC = () => {
  const handleClose = () => {
    setHandlerPelajaran("");
    setHandlerGuru(0);
    setHandlerKelas(0);
    setHandlerJadwalId(0);
    setHandlerWaktu("");
    mapelState.onCloseAddModal();
  };

  const [handlePelajaran, setHandlerPelajaran] = useState<string>("");
  const [handleGuru, setHandlerGuru] = useState<number>(0);
  const [handleKelas, setHandlerKelas] = useState<number>(0);
  const [handleJadwalId, setHandlerJadwalId] = useState<number>(0);
  const [handleWaktu, setHandlerWaktu] = useState<string>("");

  // const [editPelajaran, setEditPelajaran] = useState<string>("");
  // const [editGuru, setEditGuru] = useState<number>(0);
  // const [editKelas, setEditKelas] = useState<number>(0);
  // const [editJadwal, setEditJadwal] = useState<number>(0);
  // const [editWaktu, setEditWaktu] = useState<string>("");

  //Zustand Store
  const mapelState = useAdminMapel((state) => state);

  useEffect(() => {
    mapelState.getMapel(1);
  }, []);

  async function openModalApi() {
    mapelState.onOpenAddModal();
    await mapelState.getGuruByRole();
    await mapelState.getKelas();
  }

  return (
    <>
      <ToastContainer />
      <Button
        onClick={() => openModalApi()}
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
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Edit
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Hapus
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapelState.mapel?.map((row, i) => {
              console.log(row);
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
                  <TableCell align="center" component="th" scope="row">
                    <Button
                      onClick={() => {
                        console.log("Di Click");
                      }}
                      variant="contained"
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    <Button
                      onClick={() => {
                        console.log("Di Click");
                      }}
                      variant="contained"
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={mapelState.addModalTrigger}
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
                onChange={(e) => setHandlerGuru(Number(e.target.value))}
              >
                <MenuItem value={999} disabled>
                  Pilih Guru
                </MenuItem>
                {mapelState.dataGuru?.map((e) => {
                  return (
                    <MenuItem key={e.guru_id} value={e.guru_id}>
                      {e.nama}
                    </MenuItem>
                  );
                })}
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
                onChange={(e) => setHandlerKelas(Number(e.target.value))}
              >
                <MenuItem value={999} disabled>
                  Pilih Kelas
                </MenuItem>
                {mapelState.dataKelas?.map((e) => {
                  return (
                    <MenuItem key={e.kelas_id} value={e.kelas_id}>
                      Kelas {e.nomor_kelas}
                    </MenuItem>
                  );
                })}
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
                onChange={(e) => setHandlerJadwalId(Number(e.target.value))}
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
};

export default AdminMapel;
