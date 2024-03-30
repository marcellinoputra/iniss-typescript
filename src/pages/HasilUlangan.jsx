import React, { useEffect, useState, useRef } from "react";
import {
  FetchHasilUlangan,
  FetchHasilUlanganById,
} from "../repository/HasilUlangan_api";
import {
  Box,
  Button,
  Fade,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axiosNew from "../components/AxiosConfig";
import { ToastContainer, toast } from "react-toastify";

export default function HasilUlangan() {
  const tableRef = useRef(null);
  const [dataJawaban, setDataJawaban] = useState([]);
  const [dataDetailEssay, setDataDetailEssay] = useState([]);
  const [dataJawabanEssay, setDataJawabanEssay] = useState([]);
  const [showJawaban, setShowJawaban] = useState(false);
  const [totalBenar, setTotalBenar] = useState(0);
  const [totalSalah, setTotalSalah] = useState(0);
  const [switchTotalBenar, setSwitchTotalBenar] = useState([]);
  const [userId, setUserId] = useState();
  const [ujianId, setUjianId] = useState();

  const onHideJawaban = () => {
    setShowJawaban(false);
  };

  const submitNilaiEssay = async () => {
    await axiosNew
      .put(
        `/update-essay/${ujianId}/${userId}`,
        {
          total_benaressay: totalBenar,
          total_salahessay: dataDetailEssay.length - totalBenar,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(() => {
        toast.success("Berhasil submit nilai");
        setShowJawaban(false);
        fetchDataHasilUlangan();
      })
      .catch((err) => {
        // // console.log("error", err);
        toast.error("Gagal submit nilai");
      });
  };

  const fetchDataHasilUlangan = async () => {
    setDataJawaban([]);
    await FetchHasilUlangan()
      .then((res) => {
        setDataJawaban(res.data.data);
      })
      .catch((err) => {
        // // console.log("error", err);
      });
  };

  const fetchDetailEssay = async (id) => {
    await FetchHasilUlanganById(id)
      .then((res) => {
        setDataDetailEssay(res.data.essay) ?? [];
        // set to default salah with all length res.data.essay
        setSwitchTotalBenar(Array(res.data.essay.length).fill(false));
      })
      .catch((err) => {
        // // console.log("error", err);
      });
  };

  useEffect(() => {
    fetchDataHasilUlangan();
  }, []);

  return (
    <>
      <ToastContainer />
      <TableContainer
        sx={{ marginTop: 3, display: "block" }}
        component={Paper}
        ref={tableRef}
      >
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
                Nama Siswa
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Mata Pelajaran
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Total Benar
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Total Salah
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Dibuat Pada
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataJawaban.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {i + 1}
                </TableCell>
                <TableCell align="center">{row.siswa.nama}</TableCell>
                <TableCell align="center">{row.ujian.pelajaran.nama}</TableCell>
                <TableCell align="center">{row.total_benar}</TableCell>
                <TableCell align="center">{row.total_salah}</TableCell>
                <TableCell align="center">{new Date(row.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Button
                    className="btn_absen"
                    sx={{
                      marginTop: 1,
                    }}
                    variant="contained"
                    onClick={async () => {
                      setShowJawaban(true);
                      setDataJawabanEssay(JSON.parse(row.jawaban_essay));
                      setUserId(row.siswa.siswa_id);
                      setUjianId(row.jawaban_user_id);
                      await fetchDetailEssay(row.ujian_id);
                    }}
                  >
                    Check Jawaban
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal buat check jawaban */}
      <Modal
        disablePortal
        open={showJawaban}
        onClose={onHideJawaban}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "90vh",
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 70,
            }}
          >
            Check Jawaban Essay
          </Typography>

          {dataDetailEssay.map((item, i) => (
            <Box
              sx={{
                marginBottom: 2,
                padding: 3,
                borderRadius: 2,
                border: "0.3px solid #808080",
              }}
              key={i}
            >
              <Typography
                variant="subtitle1"
                component="p"
                gutterBottom
                style={{
                  marginBottom: 30,
                }}
              >
                {item.soal}
              </Typography>
              <TextField
                id="outlined-basic"
                label="Jawaban"
                variant="outlined"
                style={{
                  width: "100%",
                }}
                value={dataJawabanEssay[i]}
                disabled
              />
              <RadioGroup row>
                <FormControlLabel
                  control={<Switch />}
                  label={switchTotalBenar[i] ? "Benar" : "Salah"}
                  onChange={(v) => {
                    // set salah or benar, if salah set totalSalah + 1, if benar set totalBenar + 1, and change switchTotalBenar[i] to true or false
                    if (v.target.checked) {
                      setTotalBenar(totalBenar + 1);
                      setSwitchTotalBenar(
                        switchTotalBenar.map((item, index) => {
                          if (index === i) {
                            return true;
                          } else {
                            return item;
                          }
                        })
                      );
                    } else {
                      setTotalSalah(totalSalah + 1);
                      setSwitchTotalBenar(
                        switchTotalBenar.map((item, index) => {
                          if (index === i) {
                            return false;
                          } else {
                            return item;
                          }
                        })
                      );
                    }
                  }}
                />
              </RadioGroup>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={() => {
              submitNilaiEssay();
            }}
          >
            Submit Nilai
          </Button>
        </Box>
      </Modal>
    </>
  );
}
