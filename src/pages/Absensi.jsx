import React, {useEffect,useState,useRef} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import BarLoader from "react-spinners/BarLoader.js";
import { MonthModels } from "../models/Month_models";
import {
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "../style/absensi.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { AccountCircle, Close, Search } from "@mui/icons-material";
import axiosNew from "../components/AxiosConfig";
import cryptoJS from "crypto-js";
import { useAbsen } from "../store/absen.store";
import { usePelajaran } from "../store/pelajaran.store";
import { useKelas } from "../store/kelas.store";
import { useUserList } from "../store/users_list.store";
import { useGuru } from "../store/guru.store";

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

export default function Absensi() {
  const [getMonth, setGetMonth] = useState(0);
  const [absenData, setAbsenData] = useState([]);
  const [orderBy, setOrderBy] = useState("ASC");
  const [filterGuru, setFilterGuru] = useState("");
  const [month, setFilterMonth] = useState("");
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(undefined);
  const [isThrottled, setIsThrottled] = useState(false);

  // For Absen Manual
  const [addUser, setAddUser] = useState("");
  const [addNamaGuru, setAddNamaGuru] = useState("");
  const [addNamaUser, setAddNamaUser] = useState("");
  const [addPelajaran, setAddPelajaran] = useState("");
  const [addNomorKelas, setAddNomorkelas] = useState("");
  const [addKeterangan, setAddKeterangan] = useState("");
  const [addAlasan, setAddAlasan] = useState("");
  const [addHari, setAddHari] = useState("");
  const [addBulan, setAddBulan] = useState("");
  const [addTahun, setAddTahun] = useState("");
  const [addWaktu, setAddWaktu] = useState("");
  //

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [openManual, setOpenManual] = useState(false);
  const handleCloseManual = () => setOpenManual(false);

  const [editId, setEditId] = useState("");
  const [editNamaGuru, setNamaGuru] = useState("");
  const [editNamaUser, setEditNamaUser] = useState("");
  const [editPelajaran, setEditPelajaran] = useState("");
  const [editNomorKelas, setEditNomorkelas] = useState("");
  const [editKeterangan, setEditKeterangan] = useState("");
  const [editAlasan, setEditAlasan] = useState("");
  const [editHari, setEditHari] = useState("");
  const [editBulan, setEditBulan] = useState("");
  const [editTahun, setEditTahun] = useState("");
  const [editWaktu, setEditWaktu] = useState("");

  //
  const [dataGuru, setDataGuru] = useState([]);
  const [dataPelajaran, setDataPelajaran] = useState([]);
  const [dataKelas, setDataKelas] = useState([]);
  const [editValueGuru, setDataValueGuru] = useState("");
  const [editValueKelas, setDataValueKelas] = useState("");
  const [editValuePelajaran, setDataValuePelajaran] = useState("");

  const [dataUser, setDataUser] = useState([]);

  const token = localStorage.getItem("token");

  const dataKeterangan = [
    { id: 1, value: "ABSEN" },
    { id: 2, value: "IZIN" },
  ];

  async function handleOpen(
    id,
    namaUser,
    namaGuru,
    pelajaran,
    nomorKelas,
    keterangan,
    alasan,
    hari,
    bulan,
    tahun,
    waktu
  ) {
    setEditId(id);
    setEditNamaUser(namaUser);
    setNamaGuru(namaGuru);
    setEditPelajaran(pelajaran);
    setEditNomorkelas(nomorKelas);
    setEditKeterangan(keterangan);
    setEditAlasan(alasan);
    setEditHari(hari);
    setEditBulan(bulan);
    setEditTahun(tahun);
    setEditWaktu(waktu);
    setOpen(true);

    async function getGuru() {
      setLoading(true);
      await axiosNew.get("/guru").then(function (res) {
        setDataValueGuru(res.data.data.find((item) => item.nama === namaGuru));
        setNamaGuru(res.data.data.find((item) => item.nama === namaGuru));
        setDataGuru(res.data.data);
        setLoading(false);
      });
    }
    async function getPelajaran() {
    
      setLoading(true);
      await axiosNew
        .get("/find-pelajaran", {
          headers: {
            "x-access-token": token,
          },
        })
        .then(function (res) {
          setDataValuePelajaran(
            res.data.data.find((item) => item.nama === pelajaran)
          );
          setEditPelajaran(
            res.data.data.find((item) => item.nama === pelajaran)
          );
          setDataPelajaran(res.data.data);
          setLoading(false);
        });
    }
    async function getKelas() {
      setLoading(true);

      await axiosNew.get("/kelas").then(function (res) {
        setDataValueKelas(
          res.data.data.find((item) => item.nomor === nomorKelas)
        );
        setEditNomorkelas(
          res.data.data.find((item) => item.nomor === nomorKelas)
        );
        setDataKelas(res.data.data);
        setLoading(false);
      });
    }
    await getGuru();
    await getPelajaran();
    await getKelas();
  }

  async function handleOpenAbsenManual() {
    setOpenManual(true);
  }

  async function filterData() {
    let params = {};
    if (
      month === "" &&
      filterGuru === "" &&
      orderBy !== "" &&
      search === undefined
    ) {
      params = {
        orderby: orderBy,
      };
    } else if (
      month !== "" &&
      filterGuru === "" &&
      orderBy !== "" &&
      search === undefined
    ) {
      params = {
        month: month,
        orderby: orderBy,
      };
    } else if (
      month !== "" &&
      filterGuru !== "" &&
      orderBy !== "" &&
      search === undefined
    ) {
      params = {
        gurunama: filterGuru,
        month: month,
        orderby: orderBy,
      };
      //aa
    } else if (
      month === "" &&
      filterGuru === "" &&
      orderBy !== "" &&
      search !== undefined
    ) {
      params = {
        search: search,
        orderby: orderBy,
      };
    } else if (month !== "" && filterGuru === "" && orderBy !== "") {
      params = {
        search: search,
        month: month,
        orderby: orderBy,
      };
    }
    useAbsen.getState().getAbsenFilterOrderBy(params);
  }

  async function submitEdit() {
    let formData = {};
    if (editKeterangan === "IZIN") {
      formData = {
        guru_id: editNamaGuru.id === undefined ? editNamaGuru : editNamaGuru.id,
        pelajaran_id:
          editPelajaran.id === undefined ? editPelajaran : editPelajaran.id,
        kelas_id:
          editNomorKelas.nomor === undefined
            ? editNomorKelas
            : editNomorKelas.nomor,
        keterangan: editKeterangan,
        reason: editAlasan,
        day: editHari,
        month: editBulan,
        year: editTahun,
        time: editWaktu,
      };
    } else {
      formData = {
        guru_id: editNamaGuru.id === undefined ? editNamaGuru : editNamaGuru.id,
        pelajaran_id:
          editPelajaran.id === undefined ? editPelajaran : editPelajaran.id,
        kelas_id:
          editNomorKelas.nomor === undefined
            ? editNomorKelas
            : editNomorKelas.nomor,
        keterangan: editKeterangan,
        reason: "-",
        day: editHari,
        month: editBulan,
        year: editTahun,
        time: editWaktu,
      };
    }
    await useAbsen.getState().editAbsen(formData,editId)
  }


  const handleChangeThrottle = async () => {
    if (!isThrottled) {
      await filterData();
      setIsThrottled(true);
      setTimeout(() => {
        setIsThrottled(false);
      }, 500);
    }
  };

  useEffect(() => {
    useAbsen.getState().getAbsen()
    useGuru.getState().getDataGuru()
    usePelajaran.getState().getPelajaran()
    useKelas.getState().getDataKelas()
    useUserList.getState().getUsers()
    setGetMonth(new Date().getMonth() + 1);
  }, [openManual]);

  return (
    <>
      <TextField
        id="input-with-icon-textfield"
        label="Search Nama User"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        onChange={(e) => {
          setSearch(e.target.value), handleChangeThrottle();
        }}
        variant="standard"
      />
      <div className="filter_style">
        <Button
          className="btn_absen"
          sx={{
            marginTop: 1,
          }}
          onClick={handleOpenAbsenManual}
          variant="contained"
        >
          Absen Manual
        </Button>

        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Bulan</InputLabel>
            <Select
              sx={{
                height: 40,
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={month === "" ? getMonth : month}
              label="Bulan"
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              {MonthModels.map((e) => (
                <MenuItem key={e.value} value={e.value}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              sx={{
                height: 40,
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={orderBy}
              label="Filter"
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <MenuItem value="DESC">Filter by Descending</MenuItem>
              <MenuItem value="ASC">Filter by Ascending</MenuItem>
            </Select>
          </FormControl>

          <Button
            sx={{
              marginTop: 1,
            }}
            onClick={filterData}
            variant="contained"
          >
            Filter
          </Button>
        </div>
      </div>
      {loading ? (
        <BarLoader
          color="#274F99"
          loading={loading}
          size={30}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <TableContainer component={Paper} ref={tableRef}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Nama User</TableCell>
                <TableCell align="left" style={{
                fontWeight: "bold"
              }}>Nama Guru</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Pelajaran</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Nomor Kelas</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Keterangan</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Alasan</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Hari</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Bulan</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Tahun</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Waktu</TableCell>
                <TableCell align="left"style={{
                fontWeight: "bold"
              }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {useAbsen.getState().absen.map((row, i) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {i + 1}
                  </TableCell>
                  <TableCell align="left" >{row.nama_user}</TableCell>
                  <TableCell align="left">{row.nama_guru}</TableCell>
                  <TableCell align="left">{row.pelajaran_nama}</TableCell>
                  <TableCell align="left">{row.nomor_kelas}</TableCell>
                  <TableCell align="left">
                    {row.keterangan === "ABSEN" ? (
                      <Chip label={row.keterangan} color="success" />
                    ) : (
                      <Chip label={row.keterangan} color="error" />
                    )}
                  </TableCell>
                  <TableCell align="left">{row.reason}</TableCell>

                  <TableCell align="left">{row.day}</TableCell>
                  <TableCell align="left">{row.month}</TableCell>
                  <TableCell align="left">{row.year}</TableCell>
                  <TableCell align="left">{row.time}</TableCell>
                  <TableCell align="left">
                    <Button
                      className="btn_absen"
                      sx={{
                        marginTop: 1,
                      }}
                      onClick={() =>
                        handleOpen(
                          row.id,
                          row.nama_user,
                          row.nama_guru,
                          row.pelajaran_nama,
                          row.nomor_kelas,
                          row.keterangan,
                          row.reason,
                          row.day,
                          row.month,
                          row.year,
                          row.time
                        )
                      }
                      variant="contained"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
                      Ubah Data Absen
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-label">
                        Nama Guru
                      </InputLabel>
                      <Select
                        sx={{
                          height: 40,
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Nama Guru"
                        value={
                          editNamaGuru.id === undefined
                            ? editNamaGuru
                            : editNamaGuru.id
                        }
                        onChange={(e) => setNamaGuru(e.target.value)}
                      >
                        {dataGuru.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.nama}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                        value={
                          editPelajaran.id === undefined
                            ? editPelajaran
                            : editPelajaran.id
                        }
                        onChange={(e) => setEditPelajaran(e.target.value)}
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
                        value={
                          editNomorKelas.nomor === undefined
                            ? editNomorKelas
                            : editNomorKelas.nomor
                        }
                        onChange={(e) => setEditNomorkelas(e.target.value)}
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
                        Keterangan
                      </InputLabel>
                      <Select
                        sx={{
                          height: 40,
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Keterangan"
                        value={editKeterangan}
                        onChange={(e) => setEditKeterangan(e.target.value)}
                      >
                        {dataKeterangan.map((e) => (
                          <MenuItem key={e.id} value={e.value}>
                            {e.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {editKeterangan === "IZIN" ? (
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <TextField
                          size="small"
                          id="outlined"
                          label="Alasan"
                          type="text"
                          value={editAlasan}
                          onChange={(e) => setEditAlasan(e.target.value)}
                        />
                      </FormControl>
                    ) : null}
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Tanggal"
                        type="text"
                        value={editHari}
                        onChange={(e) => setEditHari(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Bulan"
                        type="text"
                        value={editBulan}
                        onChange={(e) => setEditBulan(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Tahun"
                        type="text"
                        value={editTahun}
                        onChange={(e) => setEditTahun(e.target.value)}
                      />
                    </FormControl>
                    <Button
                      style={{
                        marginTop: 30,
                      }}
                      onClick={submitEdit}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </div>
                </Box>
              </Modal>
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
                        Nama Guru
                      </InputLabel>
                      <Select
                        sx={{
                          height: 40,
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Nama Guru"
                        value={addNamaGuru}
                        onChange={(e) => setAddNamaGuru(e.target.value)}
                      >
                        {useGuru.getState().guru.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.nama}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                        value={addPelajaran}
                        onChange={(e) => setAddPelajaran(e.target.value)}
                      >
                        {usePelajaran.getState().pelajaran.map((e) => (
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
                        value={addNomorKelas}
                        onChange={(e) => setAddNomorkelas(e.target.value)}
                      >
                        {useKelas.getState().kelas.map((e) => (
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
                        value={addUser}
                        onChange={(e) => setAddUser(e.target.value)}
                      >
                        {useUserList.getState().users.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.nama}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-label">
                        Keterangan
                      </InputLabel>
                      <Select
                        sx={{
                          height: 40,
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Keterangan"
                        value={addKeterangan}
                        onChange={(e) => setAddKeterangan(e.target.value)}
                      >
                        {dataKeterangan.map((e) => (
                          <MenuItem key={e.id} value={e.value}>
                            {e.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {editKeterangan === "IZIN" ? (
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <TextField
                          size="small"
                          id="outlined"
                          label="Alasan"
                          type="text"
                          value={addAlasan}
                          onChange={(e) => setAddAlasan(e.target.value)}
                        />
                      </FormControl>
                    ) : null}
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Tanggal"
                        type="number"
                        value={addHari}
                        onChange={(e) => setAddHari(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Bulan"
                        type="number"
                        value={addBulan}
                        onChange={(e) => setAddBulan(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Tahun"
                        type="number"
                        value={addTahun}
                        onChange={(e) => setAddTahun(e.target.value)}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <TextField
                        size="small"
                        id="outlined"
                        label="Waktu"
                        type="text"
                        value={addWaktu}
                        onChange={(e) => setAddWaktu(e.target.value)}
                      />
                    </FormControl>
                    <Button
                      style={{
                        marginTop: 30,
                      }}
                      onClick={() => useAbsen.getState().createAbsen(addNamaGuru,addPelajaran,addNomorKelas,addUser,addKeterangan,addAlasan,addHari,addBulan,addTahun,addWaktu,editKeterangan)}
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
      )}
    </>
  );
}
