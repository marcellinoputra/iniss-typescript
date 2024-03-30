import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useKelasAdmin } from "../../store/admin/admin_kelas.store";
import { useEffect } from "react";
import { useState } from "react";

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

export default function AdminKelas() {

  // State Create
  const [handleGuru, setHandleGuru] = useState(999);
  const [addNomorKelas, setAddNomorKelas] = useState("");
  const [addJumlahMurid, setAddJumlahMurid] = useState(0);

  // State Edit
  const [editId, setEditId] = useState(0);
  const [editHandleGuru, setEditHandleGuru] = useState(999);
  const [editNomorKelas, setEditNomorKelas] = useState("");
  const [editJumlahMurid, setEditJumlahMurid] = useState(0);

  // State Delete
  const [deleteId, setDeleteId] = useState();

  //Store
  const kelasStore = useKelasAdmin((state) => state);

  const handleClose = () => {
    setHandleGuru(999);
    setAddNomorKelas("");
    setAddJumlahMurid(0);
    kelasStore.closeAddModal();
  };

  // async function openModalApi() {
  //   kelasStore.getGuruForAdmin();
  //   kelasStore.openAddModal();
  // }

  // Open Modal for Edit
  const handleOpenEdit = (id, guru_id, nomor_kelas, jumlah_orang) => {
    setEditId(id);
    setEditHandleGuru(guru_id);
    setEditNomorKelas(nomor_kelas);
    setEditJumlahMurid(Number(jumlah_orang));
    kelasStore.getGuruForAdmin();
    kelasStore.openEditModal();
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    kelasStore.openDeleteModal();
  };

  useEffect(() => {
    kelasStore.getDataKelas();
    kelasStore.getGuruForAdmin();
  }, []);

  return (
    <>
      <ToastContainer />

      <Button
        onClick={() => kelasStore.openAddModal()}
        style={{
          marginTop: "20px",
          marginBottom: "30px",
        }}
        variant="contained"
        color="primary"
      >
        Tambah Kelas
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                No
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Kelas ID
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Nama Guru
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Nomor Kelas
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Jumlah Murid
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Ubah Data
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Hapus Data
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kelasStore.kelas?.map((data, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    <Typography sx={{ fontFamily: "Poppins" }}>
                      {i + 1}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">
                    <Typography sx={{ fontFamily: "Poppins" }}>
                      {data.kelas_id}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">
                    <Typography sx={{ fontFamily: "Poppins" }}>
                      {data.guru_users.nama}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">
                    <Typography sx={{ fontFamily: "Poppins" }}>
                      {data.nomor_kelas}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">
                    <Typography sx={{ fontFamily: "Poppins" }}>
                      {data.jumlah_orang}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" component="th" scope="row">
                    <Button
                      onClick={() =>
                        handleOpenEdit(
                          data.kelas_id,
                          data.guru_id,
                          data.nomor_kelas,
                          data.jumlah_orang
                        )
                      }
                      sx={{ float: "center", fontFamily: "Poppins" }}
                      variant="contained"
                    >
                      Ubah
                    </Button>
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    <Button
                      onClick={() => handleOpenDelete(data.kelas_id)}
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

      {/* Modal Create */}
      <Modal
        open={kelasStore.addModalTrigger}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} autoComplete="off">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Tambah Kelas
            </Typography>
            <FormControl
              fullWidth
              style={{
                marginTop: "40px",
              }}
            >
              <Select
                sx={{
                  height: 40,
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={handleGuru ?? 999}
                onChange={(e) => setHandleGuru(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Guru
                </MenuItem>
                {kelasStore.guru?.map((data) => {
                  return (
                    <MenuItem key={data.guru_id} value={data.guru_id}>
                      {data.nama}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <TextField
                size="small"
                id="outlined"
                label="Kelas"
                type="text"
                value={addNomorKelas}
                onChange={(e) => setAddNomorKelas(e.target.value)}
              />
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <TextField
                size="small"
                id="outlined"
                label="Jumlah Murid"
                type="number"
                value={addJumlahMurid}
                onChange={(e) => setAddJumlahMurid(e.target.value)}
              />
            </FormControl>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "40px",
              }}
            >
              <Button variant="contained" color="error" onClick={handleClose}>
                Tutup
              </Button>

              <Button
                variant="contained"
                onClick={() =>
                  kelasStore.submitKelas(
                    handleGuru,
                    addNomorKelas,
                    addJumlahMurid
                  )
                }
              >
                Kirim Data
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      {/* End Modal Create */}

      {/* Modal Edit */}
      <Modal
        open={kelasStore.editModalTrigger}
        onClose={() => kelasStore.closeEditModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} autoComplete="off">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Edit Data Kelas
            </Typography>
            <FormControl
              fullWidth
              style={{
                marginTop: "40px",
              }}
            >
              <Select
                sx={{
                  height: 40,
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editHandleGuru}
                onChange={(e) => setEditHandleGuru(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Guru
                </MenuItem>
                {kelasStore.guru?.map((data) => (
                  <MenuItem key={data.guru_id} value={data.guru_id}>
                    {data.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <TextField
                size="small"
                id="outlined"
                label="Kelas"
                type="text"
                value={editNomorKelas}
                onChange={(e) => setEditNomorKelas(e.target.value)}
              />
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <TextField
                size="small"
                id="outlined"
                label="Jumlah Murid"
                type="number"
                value={Number(editJumlahMurid)}
                onChange={(e) => setEditJumlahMurid(e.target.value)}
              />
            </FormControl>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "40px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => kelasStore.closeEditModal()}
              >
                Tutup
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  kelasStore.editKelas(
                    editId,
                    editHandleGuru,
                    editNomorKelas,
                    Number(editJumlahMurid)
                  );
                }}
              >
                Update Data
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      {/* End Modal Edit */}

      {/* Modal for Delete */}
      <Modal
        open={kelasStore.deleteModalTrigger}
        onClose={() => kelasStore.closeDeleteModal()}
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
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                marginBottom: "30px",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Hapus Data Kelas
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
              }}
            >
              Apakah Kamu Yakin Ingin Menghapus Kelas Ini ??
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "40px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => kelasStore.closeDeleteModal()}
              >
                Tutup
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  kelasStore.deleteKelas(deleteId);
                }}
              >
                Hapus Data
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      {/* End Modal Delete */}
    </>
  );
}
