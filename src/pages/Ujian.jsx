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
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { ToastContainer, toast } from "react-toastify";
import axiosNew from "../components/AxiosConfig";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useKelas } from "../store/ujian.store";
import { PhotoCamera } from "@mui/icons-material";
import { useMediaQuery } from "react-responsive";
import { formatDate } from "../helper/DateConverter";

export default function Ujian() {
  // Store
  const kelasDatas = useKelas((state) => state.kelas)
  const fetchKelasData = useKelas((state) => state.fetchKelas)


  // Media Query
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 880px)",
  });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 880px)" });


  // State buat Create
  const [showModal, setShowModal] = useState(false);
  const [typeUjian, setTypeUjian] = useState();
  const [durasi, setDurasi] = useState();
  const [jamMulai, setJamMulai] = useState();
  const [questions, setQuestions] = useState([]);
  const [addEssay, setAddEssay] = useState(false);
  const [essay, setEssay] = useState([]);
  const [showEssayRecreate, setShowEssayRecreate] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString());
  const [dataUjian, setDataUjian] = useState([]);
  const [answerUser, setAnswerUser] = useState([]);
  const [dataPelajaran, setDataPelajaran] = useState([]);
  const [selectedPelajaran, setSelectedPelajaran] = useState();
  const tableRef = useRef(null);



  // State buat Edit
  const [keterangan, setKeterangan] = useState("");
  const [editKeterangan, setEditKeterangan] = useState("")
  const [semester, setSemester] = useState(0);
  const [editSemester, setEditSemester] = useState(0);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editTypeUjian, setEditTypeUjian] = useState();
  const [editDurasi, setEditDurasi] = useState();
  const [editJamMulai, setEditJamMulai] = useState();
  const [editQuestions, setEditQuestions] = useState([]);
  const [editAddEssay, setEditAddEssay] = useState(false);
  const [editEssay, setEditEssay] = useState([]);
  const [editDataUjian, setEditDataUjian] = useState([]);
  const [editTanggal, setEditTanggal] = useState();
  const [editSelectedPelajaran, setEditSelectedPelajaran] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState();
  const [editDataKelas, setEditDataKelas] = useState([]);
  const [editHandleKelas, setEditHandlerKelas] = useState();




  const [dataKelas, setDataKelas] = useState([]);
  const [handleKelas, setHandlerKelas] = useState();


  const [hideModalTrigger, setHideModalTrigger] = useState(false);
  const [modalRecreate, setModalRecreate] = useState(false);
  const [param, setParam] = useState("");

  // filter
  const [filterKelas, setFilterKelas] = useState();
  const [filterTipeUjian, setFilterTipeUjian] = useState("Semua");

  async function getEditUjian(id) {
    await axiosNew.get(`/ujian-detail/${id}`).then((res) => {
      setEditDataUjian(res.data);
      setEditQuestions(res.data.soal) ?? [];
      setEditEssay(res.data.essay) ?? [];
    });
  }

  // async function fetchKelas() {
  //   setDataKelas([]);
  //   const userId = localStorage.getItem("role_id");
  //   if (userId === undefined || userId === null) {
  //     toast.error("Id Guru tidak ditemukan");
  //   } else {
  //     await axiosNew.get(`/kelas?user_id=${userId}`).then((res) => {
  //       setDataKelas(res.data.data);
  //     });
  //   }
  // }

  const onHideModal = () => {
    setShowModal(false);
  };

  const onHideModalEdit = () => {
    setShowModalEdit(false);
  };

  const onHideModalRecreate = () => {
    setModalRecreate(false);
  };

  async function getUjian() {
    setAnswerUser([]);
    if (
      localStorage.getItem("role_id") !== undefined &&
      filterTipeUjian === "Semua"
    ) {
      await axiosNew
        .get("/all-ujian?guru_id=" + localStorage.getItem("role_id"), {})
        .then((res) => {
          setDataUjian(res.data.data);
          setHideModalTrigger(false);
        })
        .catch((err) => {
          // console.log(`Err when load ujian: ${err} `);
        });
    } else if (
      localStorage.getItem("role_id") !== undefined ||
      (localStorage.getItem("role_id") !== null && filterTipeUjian !== "Semua")
    ) {
      await axiosNew
        .get(
          "/all-ujian?guru_id=" +
          localStorage.getItem("role_id") +
          "&nama_ujian=" +
          filterTipeUjian,
          {}
        )
        .then((res) => {
          setDataUjian(res.data.data);
          setHideModalTrigger(false);
        })
        .catch((err) => {
          // console.log(`Err when load ujian: ${err} `);
        });
    }
  }

  async function getPelajaran() {
    setDataPelajaran([]);

    const userId = localStorage.getItem("role_id");
    // console.log(userId);
    if (userId === undefined || userId === null) {
      toast.error("Id Guru tidak ditemukan");
    } else {
      await axiosNew
        .get(`/pelajaran?user_id=${userId}`)
        .then((res) => {
          setDataPelajaran(res.data.data);
        })
        .catch((err) => {
          // console.log(`Err when load pelajaran: ${err} `);
        });
    }
  }

  const handleFileChange = (file, qIndex, cIndex) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // console.log(`Reader Result -> ${reader.result}`);
    reader.onloadend = () => {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].pilihan[cIndex]["isi_pilihan[" + cIndex + "]"] =
        reader.result;
      setQuestions(updatedQuestions);
    };
  };

  const handleFileChangeEdit = (file, qIndex, cIndex) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // console.log(`Reader Result -> ${reader.result}`);
    reader.onloadend = () => {
      const updatedQuestions = [...editQuestions];

      updatedQuestions[qIndex].pilihan[cIndex][1] = reader.result;
      setQuestions(updatedQuestions);
    };
  };

  async function onClickJawabanSiswa() {
    setDataUjian([]);
    await axiosNew.get("/all-exam", {}).then((res) => {
      setAnswerUser(res.data.data);
      setHideModalTrigger(true);
      // console.log("Data Jawaban Siswa ->", res.data.data);
    });
  }






  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions");
    const savedEssay = localStorage.getItem("essay");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedEssay) {
      setAddEssay(true);
      setEssay(JSON.parse(savedEssay));
    }
    if (savedQuestions || savedEssay) {
      if (import.meta.env.VITE_SERVER_TYPE !== "dev") {
        toast.info("Data Ujian belum disubmit, silahkan submit!");
      }
    }
    getUjian();
    // fetchKelas();
    fetchKelasData()

    // console.log(`Kelas -> ${kelasDatas}`)
    getPelajaran();
  }, []);

  useEffect(() => {
    if (!isEdit) {
      localStorage.setItem("questions", JSON.stringify(questions));
      localStorage.setItem("essay", JSON.stringify(essay));
    }
  }, [questions, essay]);

  async function createUjian() {
    await axiosNew
      .post(
        "/create-ujian",
        {
          nama_ujian: typeUjian,
          mapel: selectedPelajaran ?? dataPelajaran[0]?.pelajaran_id,
          jam: jamMulai + ".00",
          durasi: durasi,
          kelas_id: handleKelas,
          semester: semester,
          tanggal: new Date(tanggal).toISOString(),
          total_soal: questions.length + essay.length,
          keterangan: keterangan,
          soal: questions,
          essay: essay,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Berhasil Membuat Ujian");
          localStorage.removeItem("questions");
          localStorage.removeItem("essay");
          getUjian();
          setShowModal(false);
        } else {
          // console.log(res);
        }
      })
      .catch((err) => {
        // console.log(err);
        toast.error(err.response.data.message);
      });
  }

  async function createUjianFromRecreate() {
    await axiosNew
      .post(
        "/create-ujian",
        {
          nama_ujian: editTypeUjian,
          mapel: editSelectedPelajaran,
          jam: editJamMulai + ".00",
          durasi: editDurasi,
          kelas_id: 5,
          semester: editSemester,
          tanggal: new Date(editTanggal).toISOString(),
          total_soal: editQuestions.length + editEssay.length,
          keterangan: editKeterangan,
          soal: editQuestions,
          essay: editEssay,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Berhasil Membuat Ulang Ujian");
          localStorage.removeItem("questions");
          localStorage.removeItem("essay");
          getUjian();
          setModalRecreate(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  async function editUjian(id) {
    await axiosNew
      .put(
        `/edit-ujian/${id}`,
        {
          nama_ujian: editTypeUjian,
          mapel: editSelectedPelajaran,
          jam: editJamMulai,
          durasi: editDurasi,
          total_soal: editQuestions.length + editEssay.length,
          soal: editQuestions,
          essay: editEssay,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        // console.log("Sukses Edit Ujian");
        getUjian();
        toast.success("Berhasil Edit Ujian");
      })
      .catch((err) => {
        console.error("Gagal Edit Ujian");
        toast.error("Gagal Edit Ujian");
      });
  }

  async function recreateEditUjian() {
    await axiosNew
      .post(
        `/create-ujian`,
        {
          nama_ujian: editTypeUjian,
          mapel: editSelectedPelajaran,
          jam: editJamMulai,
          durasi: editDurasi,
          total_soal: editQuestions.length + editEssay.length,
          soal: editQuestions,
          tanggal: new Date(editTanggal).toISOString(),
          essay: editEssay,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        getUjian();
        toast.success("Berhasil Buat Ulang Ujian");
      })
      .catch((err) => {
        console.error("Gagal Edit Ujian");
        toast.error("Gagal Buat Ulang Ujian");
      });
  }

  const [choiceInputType, setChoiceInputType] = useState({});

  const toggleChoiceInputType = (questionIndex, choiceIndex) => {
    const newChoiceInputType = { ...choiceInputType };
    const key = `${questionIndex}-${choiceIndex}`;
    newChoiceInputType[key] =
      newChoiceInputType[key] === "image" ? "text" : "image";
    setChoiceInputType(newChoiceInputType);
  };

  return (
    <>
      <ToastContainer />
      {isTabletOrMobile ? (
        <div></div>
      ) : (
        <div
          className="flex flex-col lg:flex-row"
          style={{
            marginBottom: isTabletOrMobile ? 30 : 0,
            marginTop: "20px",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            sx={{
              width: isDesktopOrLaptop ? 200 : "100%",
            }}
            variant="contained"
            onClick={async () => {
              setShowModal(true);
            }}
          >
            Buat Ujian
          </Button>
          {/* <Button style={{
          marginRight: isDesktopOrLaptop ? 10 : 0,
          marginBottom: isDesktopOrLaptop ? 0 : 20,
          marginTop: isDesktopOrLaptop ? 0 : 20,
          marginLeft: isDesktopOrLaptop ? 10 : 0,
        }} variant='contained' onClick={() => getUjian()}>Cek Soal</Button> */}
          {/* <Button className='lg:ml-2' variant='contained' onClick={() => onClickJawabanSiswa()}>Cek Jawaban Siswa</Button> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
            }}
          >
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterKelas ?? 999}
              sx={{
                height: 40,
              }}
              defaultValue={999}
              onChange={(e) => {
                setFilterKelas(e.target.value);
              }}
            >
              <MenuItem value={999} disabled>
                Filter dari Kelas
              </MenuItem>
              {dataKelas.map((kelas, i) => (
                <MenuItem key={i} value={kelas.kelas_id}>
                  {kelas.nomor_kelas}
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{
                height: 40,
                marginLeft: 2,
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterTipeUjian ?? ""}
              defaultValue={"Semua"}
              onChange={(e) => setFilterTipeUjian(e.target.value)}
            >
              <MenuItem value={"Semua"}>Semua</MenuItem>
              <MenuItem value={"Ujian Tengah Semester"}>
                Ujian Tengah Semester
              </MenuItem>
              <MenuItem value={"Ujian Akhir Semester"}>
                Ujian Akhir Semester
              </MenuItem>
              <MenuItem value={"Ulangan Harian"}>Ulangan Harian</MenuItem>
            </Select>
            <Button
              style={{
                marginLeft: 16,
              }}
              variant="contained"
              onClick={async () => {
                await getUjian();
              }}
            >
              Search
            </Button>
          </div>
        </div>
      )}

      {/* Modal untuk Buat Ujian */}

      <Modal
        disablePortal
        open={showModal}
        onClose={onHideModal}
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
              Buat Ujian / Ulangan
            </Typography>
            <FormControl
              fullWidth
              style={{
                marginTop: "50px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={typeUjian ?? "nonvalue"}
                defaultValue={"nonvalue"}
                onChange={(e) => {
                  setTypeUjian(e.target.value);
                  if (
                    e.target.value === "Ujian Tengah Semester" ||
                    e.target.value === "Ujian Akhir Semester"
                  ) {
                    setDurasi(60);
                  } else {
                    setDurasi(null)
                  }
                }}
              >
                <MenuItem value={"nonvalue"} disabled>
                  Pilih Tipe Ujian
                </MenuItem>
                <MenuItem value={"Ujian Tengah Semester"}>
                  Ujian Tengah Semester
                </MenuItem>
                <MenuItem value={"Ujian Akhir Semester"}>
                  Ujian Akhir Semester
                </MenuItem>
                <MenuItem value={"Ulangan Harian"}>Ulangan Harian</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={durasi ?? 999}
                defaultValue={999}
                onChange={(e) => setDurasi(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Durasi Ujian / Ulangan
                </MenuItem>
                <MenuItem value={15}>15 Menit</MenuItem>
                <MenuItem value={30}>30 Menit</MenuItem>
                <MenuItem value={45}>45 Menit</MenuItem>
                <MenuItem value={60}>60 Menit</MenuItem>
                <MenuItem value={90}>90 Menit</MenuItem>
                <MenuItem value={120}>120 Menit</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={semester ?? 0}
                defaultValue={0}
                onChange={(e) => setSemester(e.target.value)}
              >
                <MenuItem value={0} disabled>
                  Pilih Semester
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={jamMulai ?? 999}
                defaultValue={999}
                onChange={(e) => setJamMulai(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Jam Mulai Ujian / Ulangan
                </MenuItem>
                <MenuItem value={"07"}>07.00</MenuItem>
                <MenuItem value={"08"}>08.00</MenuItem>
                <MenuItem value={"09"}>09.00</MenuItem>
                <MenuItem value={"10"}>10.00</MenuItem>
                <MenuItem value={"11"}>11.00</MenuItem>
                <MenuItem value={"12"}>12.00</MenuItem>
                <MenuItem value={"13"}>13.00</MenuItem>
                <MenuItem value={"14"}>14.00</MenuItem>
                <MenuItem value={"15"}>15.00</MenuItem>
                <MenuItem value={"16"}>16.00</MenuItem>
                <MenuItem value={"17"}>17.00</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPelajaran ?? 999}
                defaultValue={999}
                onChange={(e) => {
                  setSelectedPelajaran(e.target.value);
                }}
              >
                <MenuItem value={999} disabled>
                  Pilih Mata Pelajaran
                </MenuItem>
                {dataPelajaran.map((pelajaran, i) => (
                  <MenuItem key={i} value={pelajaran.pelajaran_id}>
                    {pelajaran.nama}
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
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={handleKelas ?? 999}
                defaultValue={999}
                onChange={(e) => {
                  setHandlerKelas(e.target.value);
                }}
              >
                <MenuItem value={999} disabled>
                  Pilih Kelas
                </MenuItem>
                {kelasDatas.map((kelas, i) => (
                  <MenuItem key={i} value={kelas.kelas_id}>
                    {kelas.nomor_kelas}
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
                id="outlined-basic"
                label="Keterangan"
                variant="outlined"
                onChange={(e) => setKeterangan(e.target.value)}
              />
            </FormControl>
            <InputLabel
              id="demo-simple-select-label"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              {`Tanggal Mulai`}
            </InputLabel>
            <FormControl fullWidth style={{}}>
              <TextField
                id="outlined"
                variant="outlined"
                type="date"
                onChange={(e) => setTanggal(e.target.value)}
              />
            </FormControl>

            <div
              style={{
                marginTop: "40px",
                marginBottom: "40px",
                width: "100%",
                height: "1px",
                backgroundColor: "black",
              }}
            ></div>

            <p
              style={{
                marginBottom: 30,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Soal Pilihan Ganda
            </p>

            {questions.map((question, qIndex) => (
              <div key={qIndex}>
                <FormControl fullWidth style={{}}>
                  <TextField
                    sx={{
                      width: "100%",
                      marginBottom: "20px",
                    }}
                    defaultValue={question.soal || ""}
                    label={`Soal No-${qIndex + 1}`}
                    variant="outlined"
                    onChange={(e) => {
                      questions[qIndex].soal = e.target.value;
                      // Handle text change
                    }}
                  />
                </FormControl>
                {["A", "B", "C", "D", "E"].map((choiceLabel, cIndex) => {
                  const inputTypeKey = `${qIndex}-${cIndex}`;
                  const isImageInput =
                    choiceInputType[inputTypeKey] === "image";
                  return (
                    <div key={cIndex}>
                      <>
                        <TextField
                          sx={{
                            width: "100%",
                            marginTop: "5px",
                            marginBottom: "5px",
                          }}
                          defaultValue={
                            question.pilihan[cIndex][
                            "isi_pilihan[" + cIndex + "]"
                            ] || ""
                          }
                          label={`Pilihan ${choiceLabel}`}
                          variant="outlined"
                          onChange={(e) => {
                            // Handle text change
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].pilihan[cIndex][
                              "isi_pilihan[" + cIndex + "]"
                            ] = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                        />
                      </>
                    </div>
                  );
                })}
                <FormControl fullWidth style={{}}>
                  <TextField
                    sx={{
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    defaultValue={question.jawaban || ""}
                    label={`Jawaban No-${qIndex + 1}`}
                    variant="outlined"
                    onChange={(e) => {
                      questions[qIndex].jawaban = e.target.value;
                      // Handle text change
                    }}
                  />
                </FormControl>
              </div>
            ))}
            <Button
              style={{ marginTop: "20px" }}
              variant="contained"
              onClick={() => {
                if (questions.length === 0) {
                  setQuestions([
                    ...questions,
                    {
                      id_soal: 1,
                      soal: "",
                      pilihan: Array(5)
                        .fill({})
                        .map((_, i) => ({
                          ["jenis_pilihan[" + i + "]"]: String.fromCharCode(
                            65 + i
                          ),
                          ["isi_pilihan[" + i + "]"]: "",
                        })),
                      jawaban: "",
                    },
                  ]);
                } else {
                  if (questions[questions.length - 1].soal === "") {
                    toast.error("Soal tidak boleh kosong!");
                    return;
                  } else if (questions[questions.length - 1].jawaban === "") {
                    toast.error("Jawaban tidak boleh kosong!");
                    return;
                  } else {
                    // console.log(questions);
                    setQuestions([
                      ...questions,
                      {
                        id_soal:
                          questions.length === 0 ? questions.length + 1 : 1,
                        soal: "",
                        pilihan: Array(5)
                          .fill({})
                          .map((_, i) => ({
                            ["jenis_pilihan[" + i + "]"]: String.fromCharCode(
                              65 + i
                            ),
                            ["isi_pilihan[" + i + "]"]: "",
                          })),
                        jawaban: "",
                      },
                    ]);
                  }
                }
              }}
            >
              Tambah Soal Pilihan Ganda
            </Button>
            {questions.length > 1 && (
              <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="error"
                onClick={() => {
                  setQuestions([...questions].slice(0, questions.length - 1));
                }}
              >
                Hapus 1 Soal Pilihan Ganda
              </Button>
            )}

            <FormControlLabel
              sx={{ marginTop: "50px", marginBottom: "10px" }}
              control={
                <Switch
                  checked={addEssay}
                  onChange={() => {
                    setAddEssay(!addEssay);
                  }}
                />
              }
              label="Tambahkan Essay"
            />

            {addEssay && (
              <p
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 22,
                }}
              >
                Soal Essay
              </p>
            )}

            {addEssay && (
              <>
                {essay.map((s, eIndex) => (
                  <>
                    <div style={{}} key={eIndex}>
                      <FormControl fullWidth>
                        <TextField
                          defaultValue={essay[eIndex].soal || ""}
                          label={`Soal Essay - ${eIndex + 1}`}
                          variant="outlined"
                          sx={{ marginTop: "15px" }}
                          onChange={(e) => {
                            const updatedEssay = [...essay];
                            updatedEssay[eIndex].soal = e.target.value;
                            setEssay(updatedEssay);
                          }}
                        />
                        <TextField
                          defaultValue={essay[eIndex].jawaban || ""}
                          label={`Jawaban Essay - ${eIndex + 1}`}
                          onChange={(e) => {
                            const updatedEssay = [...essay];
                            updatedEssay[eIndex].jawaban = e.target.value;
                            setEssay(updatedEssay);
                          }}
                          variant="outlined"
                          sx={{ marginTop: "15px", marginBottom: "15px" }}
                        />
                      </FormControl>
                    </div>
                  </>
                ))}
                <Button
                  style={{ marginTop: "20px" }}
                  variant="contained"
                  onClick={() => {
                    setEssay([
                      ...essay,
                      {
                        id_soal: essay.length + 1,
                        soal: "",
                        jawaban: "",
                      },
                    ]);
                  }}
                >
                  Tambah Soal Essay
                </Button>
              </>
            )}

            {essay.length > 0 ? (
              <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="error"
                onClick={() => {
                  if (essay.length === 1) {
                    setAddEssay(false);
                    setEssay([...essay].slice(0, essay.length - 1));
                  } else {
                    setEssay([...essay].slice(0, essay.length - 1));
                  }
                }}
              >
                Hapus 1 Soal Essay
              </Button>
            ) : (
              <div></div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "100px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  if (essay.length === 0) {
                    setAddEssay(false);
                  }
                  onHideModal();
                }}
              >
                Close Form
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (tanggal === undefined || tanggal === null) {
                    toast.error("Pilih tanggal ujian terlebih dahulu");
                  } else {
                    createUjian();
                  }
                }}
              >
                Submit Data
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* End Modal Buat Ujian */}

      {/* Modal untuk Buat Ulang Ujain */}

      <Modal
        disablePortal
        open={modalRecreate}
        onClose={onHideModalRecreate}
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
              Input Ulang Soal
            </Typography>
            <FormControl
              fullWidth
              style={{
                marginTop: "50px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editTypeUjian ?? "nonvalue"}
                defaultValue={editTypeUjian}
                onChange={(e) => setEditTypeUjian(e.target.value)}
              >
                <MenuItem value={"nonvalue"} disabled>
                  Pilih Tipe Ujian
                </MenuItem>
                <MenuItem value={"Ujian Tengah Semester"}>
                  Ujian Tengah Semester
                </MenuItem>
                <MenuItem value={"Ujian Akhir Semester"}>
                  Ujian Akhir Semester
                </MenuItem>
                <MenuItem value={"Ulangan Harian"}>Ulangan Harian</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editDurasi ?? 999}
                defaultValue={999}
                onChange={(e) => setEditDurasi(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Durasi Ujian / Ulangan
                </MenuItem>
                <MenuItem value={15}>15 Menit</MenuItem>
                <MenuItem value={30}>30 Menit</MenuItem>
                <MenuItem value={45}>45 Menit</MenuItem>
                <MenuItem value={60}>60 Menit</MenuItem>
                <MenuItem value={90}>90 Menit</MenuItem>
                <MenuItem value={120}>120 Menit</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editSemester ?? 0}
                defaultValue={editSemester}
                onChange={(e) => setEditSemester(e.target.value)}
              >
                <MenuItem value={0} disabled>
                  Pilih Semester
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editJamMulai ?? 999}
                defaultValue={editJamMulai}
                onChange={(e) => setEditJamMulai(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Jam Mulai Ujian / Ulangan
                </MenuItem>
                <MenuItem value={"07"}>07.00</MenuItem>
                <MenuItem value={"08"}>08.00</MenuItem>
                <MenuItem value={"09"}>09.00</MenuItem>
                <MenuItem value={"10"}>10.00</MenuItem>
                <MenuItem value={"11"}>11.00</MenuItem>
                <MenuItem value={"12"}>12.00</MenuItem>
                <MenuItem value={"13"}>13.00</MenuItem>
                <MenuItem value={"14"}>14.00</MenuItem>
                <MenuItem value={"15"}>15.00</MenuItem>
                <MenuItem value={"16"}>16.00</MenuItem>
                <MenuItem value={"17"}>17.00</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editSelectedPelajaran ?? 999}
                defaultValue={editSelectedPelajaran}
                onChange={(e) => {
                  setEditSelectedPelajaran(e.target.value);
                }}
              >
                <MenuItem value={999} disabled>
                  Pilih Mata Pelajaran
                </MenuItem>

                {dataPelajaran.map((pelajaran, i) => (
                  <MenuItem key={i} value={pelajaran.pelajaran_id}>
                    {pelajaran.nama}
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
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editHandleKelas ?? 999}
                defaultValue={editHandleKelas ?? 999}
                onChange={(e) => {
                  setEditHandlerKelas(e.target.value);
                }}
              >
                <MenuItem value={999} disabled>
                  Pilih Kelas
                </MenuItem>
                {dataKelas.map((kelas, i) => (
                  <MenuItem key={i} value={kelas.kelas_id}>
                    {kelas.nomor_kelas}
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
                id="outlined-basic"
                label="Keterangan"
                defaultValue={editKeterangan ?? ""}
                variant="outlined"
                onChange={(e) => setEditKeterangan(e.target.value)}
              />
            </FormControl>
            <InputLabel
              id="demo-simple-select-label"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              {`Tanggal Mulai`}
            </InputLabel>
            <FormControl fullWidth style={{}}>
              <TextField
                id="outlined"
                variant="outlined"
                type="date"
                value={editTanggal}
                onChange={(e) => setEditTanggal(e.target.value)}
              />
            </FormControl>

            <div
              style={{
                marginTop: "40px",
                marginBottom: "40px",
                width: "100%",
                height: "1px",
                backgroundColor: "black",
              }}
            ></div>

            <p
              style={{
                marginBottom: 30,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Soal Pilihan Ganda
            </p>

            {editQuestions.map((question, qIndex) => (
              <div key={qIndex}>
                <p style={{ marginBottom: 20 }}>Soal nomor-{qIndex + 1}</p>
                <FormControl fullWidth style={{}}>
                  <TextField
                    sx={{
                      width: "100%",
                      marginBottom: "20px",
                    }}
                    defaultValue={question.soal || ""}
                    label={`Soal No-${qIndex + 1}`}
                    variant="outlined"
                    onChange={(e) => {
                      editQuestions[qIndex].soal = e.target.value;
                      // Handle text change
                    }}
                  />
                </FormControl>
                {["A", "B", "C", "D", "E"].map((choiceLabel, cIndex) => {
                  const inputTypeKey = `${qIndex}-${cIndex}`;
                  const isImageInput =
                    choiceInputType[inputTypeKey] === "image";
                  return (
                    <div key={cIndex}>
                      <TextField
                        sx={{
                          width: "100%",
                          marginTop: "5px",
                          marginBottom: "5px",
                        }}
                        defaultValue={
                          editQuestions[qIndex].pilihan[cIndex][1] ?? ""
                        }
                        label={`Pilihan ${choiceLabel}`}
                        variant="outlined"
                        onChange={(e) => {
                          // Handle text change
                          const updatedQuestions = [...editQuestions];
                          updatedQuestions[qIndex].pilihan[cIndex][1] =
                            e.target.value;
                          setEditQuestions(updatedQuestions);
                        }}
                      />
                    </div>
                  );
                })}
                <FormControl fullWidth style={{}}>
                  <TextField
                    sx={{
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    defaultValue={question.jawaban || ""}
                    label={`Jawaban No-${qIndex + 1}`}
                    variant="outlined"
                    onChange={(e) => {
                      questions[qIndex].jawaban = e.target.value;
                      // Handle text change
                    }}
                  />
                </FormControl>
              </div>
            ))}
            <Button
              style={{ marginTop: "20px" }}
              variant="contained"
              onClick={() => {
                if (questions.length === 0) {
                  setEditQuestions([
                    ...questions,
                    {
                      id_soal: 1,
                      soal: "",
                      pilihan: Array(5)
                        .fill({})
                        .map((_, i) => ({
                          ["jenis_pilihan[" + i + "]"]: String.fromCharCode(
                            65 + i
                          ),
                          ["isi_pilihan[" + i + "]"]: "",
                        })),
                      jawaban: "",
                    },
                  ]);
                } else {
                  if (questions[questions.length - 1].soal === "") {
                    toast.error("Soal tidak boleh kosong!");
                    return;
                  } else if (questions[questions.length - 1].jawaban === "") {
                    toast.error("Jawaban tidak boleh kosong!");
                    return;
                  } else {
                    // console.log(questions);
                    setEditQuestions([
                      ...questions,
                      {
                        id_soal:
                          editQuestions.length === 0
                            ? editQuestions.length + 1
                            : 1,
                        soal: "",
                        pilihan: Array(5)
                          .fill({})
                          .map((_, i) => ({
                            ["jenis_pilihan[" + i + "]"]: String.fromCharCode(
                              65 + i
                            ),
                            ["isi_pilihan[" + i + "]"]: "",
                          })),
                        jawaban: "",
                      },
                    ]);
                  }
                }
              }}
            >
              Tambah Soal Pilihan Ganda
            </Button>

            <div
              style={{
                marginTop: "40px",
                marginBottom: "20px",
                width: "100%",
                height: "1px",
                backgroundColor: "black",
              }}
            ></div>

            {questions.length > 1 && (
              <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="error"
                onClick={() => {
                  setEditQuestions(
                    [...questions].slice(0, questions.length - 1)
                  );
                }}
              >
                Hapus 1 Soal Pilihan Ganda
              </Button>
            )}
            <FormControlLabel
              sx={{ marginTop: "50px", marginBottom: "10px" }}
              control={
                <Switch
                  checked={showEssayRecreate}
                  onChange={() => {
                    setShowEssayRecreate(!showEssayRecreate);
                  }}
                />
              }
              label="Tampilkan Input Essay"
            />
            <p
              style={{
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Soal Essay
            </p>
            {showEssayRecreate && (
              <>
                {editEssay.map((s, eIndex) => (
                  <>
                    <div style={{}} key={eIndex}>
                      {/* <p style={{ marginBottom: "20px", marginTop: "20px" }}>
                        Soal Essay nomor-{eIndex + 1}
                      </p> */}
                      <FormControl fullWidth>
                        <TextField
                          defaultValue={editEssay[eIndex].soal || ""}
                          label={`Soal Essay - ${eIndex + 1}`}
                          variant="outlined"
                          sx={{ marginTop: "15px" }}
                          onChange={(e) => {
                            const updatedEssay = [...editEssay];
                            updatedEssay[eIndex].soal = e.target.value;
                            setEditEssay(updatedEssay);
                          }}
                        />
                        <TextField
                          defaultValue={editEssay[eIndex].jawaban || ""}
                          label={`Jawaban Essay - ${eIndex + 1}`}
                          onChange={(e) => {
                            const updatedEssay = [...editEssay];
                            updatedEssay[eIndex].jawaban = e.target.value;
                            setEditEssay(updatedEssay);
                          }}
                          variant="outlined"
                          sx={{ marginTop: "15px", marginBottom: "15px" }}
                        />
                      </FormControl>
                    </div>
                  </>
                ))}
                <>
                  <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    onClick={() => {
                      setEditEssay([
                        ...editEssay,
                        {
                          id_soal: editEssay.length + 1,
                          soal: "",
                          jawaban: "",
                        },
                      ]);
                    }}
                  >
                    Tambah Soal Essay
                  </Button>
                </>
                {editEssay.length > 1 ? (
                  <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (essay.length === 1) {
                        // setShowEssayRecreate(false)
                        setEditEssay(
                          [...editEssay].slice(0, editEssay.length - 1)
                        );
                      } else {
                        setEditEssay(
                          [...editEssay].slice(0, editEssay.length - 1)
                        );
                      }
                    }}
                  >
                    Hapus 1 Soal Essay
                  </Button>
                ) : (
                  <div></div>
                )}
              </>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "100px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  if (editEssay.length === 0) {
                    setShowEssayRecreate(false);
                  }
                  onHideModalRecreate();
                }}
              >
                Close Form
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (tanggal === undefined || tanggal === null) {
                    toast.error("Pilih tanggal ujian terlebih dahulu");
                  } else {
                    createUjianFromRecreate();
                  }
                }}
              >
                Submit Data
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* End Modal Buat Ulang Ujian*/}

      {/* Modal untuk Edit Ujian - Modal Edit */}

      <Modal
        disablePortal
        open={showModalEdit}
        onClose={onHideModalEdit}
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
              Input Edit Data
            </Typography>
            <FormControl
              fullWidth
              style={{
                marginTop: "50px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editTypeUjian ?? "nonvalue"}
                defaultValue={editTypeUjian}
                onChange={(e) => setEditTypeUjian(e.target.value)}
              >
                <MenuItem value={"nonvalue"} disabled>
                  Pilih Tipe Ujian
                </MenuItem>
                <MenuItem value={"Ujian Tengah Semester"}>
                  Ujian Tengah Semester
                </MenuItem>
                <MenuItem value={"Ujian Akhir Semester"}>
                  Ujian Akhir Semester
                </MenuItem>
                <MenuItem value={"Ulangan Harian"}>Ulangan Harian</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editDurasi ?? 999}
                defaultValue={999}
                onChange={(e) => setEditDurasi(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Durasi Ujian / Ulangan
                </MenuItem>
                <MenuItem value={15}>15 Menit</MenuItem>
                <MenuItem value={30}>30 Menit</MenuItem>
                <MenuItem value={45}>45 Menit</MenuItem>
                <MenuItem value={60}>60 Menit</MenuItem>
                <MenuItem value={90}>90 Menit</MenuItem>
                <MenuItem value={120}>120 Menit</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editSemester ?? 0}
                defaultValue={editSemester}
                onChange={(e) => setEditSemester(e.target.value)}
              >
                <MenuItem value={0} disabled>
                  Pilih Semester
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editJamMulai ?? 999}
                defaultValue={editJamMulai}
                onChange={(e) => setEditJamMulai(e.target.value)}
              >
                <MenuItem value={999} disabled>
                  Pilih Jam Mulai Ujian / Ulangan
                </MenuItem>
                <MenuItem value={"07"}>07.00</MenuItem>
                <MenuItem value={"08"}>08.00</MenuItem>
                <MenuItem value={"09"}>09.00</MenuItem>
                <MenuItem value={"10"}>10.00</MenuItem>
                <MenuItem value={"11"}>11.00</MenuItem>
                <MenuItem value={"12"}>12.00</MenuItem>
                <MenuItem value={"13"}>13.00</MenuItem>
                <MenuItem value={"14"}>14.00</MenuItem>
                <MenuItem value={"15"}>15.00</MenuItem>
                <MenuItem value={"16"}>16.00</MenuItem>
                <MenuItem value={"17"}>17.00</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              style={{
                marginTop: "20px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editSelectedPelajaran ?? 999}
                defaultValue={editSelectedPelajaran}
                onChange={(e) => {
                  setEditSelectedPelajaran(e.target.value);
                }}
              >
                <MenuItem value={999} disabled>
                  Pilih Mata Pelajaran
                </MenuItem>

                {dataPelajaran.map((pelajaran, i) => (
                  <MenuItem key={i} value={pelajaran.pelajaran_id}>
                    {pelajaran.nama}
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
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editHandleKelas ?? 999}
                defaultValue={editHandleKelas ?? 999}
                onChange={(e) => {
                  setEditHandlerKelas(e.target.value);
                }}
              >
                <MenuItem value={999} disabled>
                  Pilih Kelas
                </MenuItem>
                {dataKelas.map((kelas, i) => (
                  <MenuItem key={i} value={kelas.kelas_id}>
                    {kelas.nomor_kelas}
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
                id="outlined-basic"
                label="Keterangan"
                defaultValue={editKeterangan ?? ""}
                variant="outlined"
                onChange={(e) => setEditKeterangan(e.target.value)}
              />
            </FormControl>
            <InputLabel
              id="demo-simple-select-label"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              {`Tanggal Mulai`}
            </InputLabel>
            <FormControl fullWidth style={{}}>
              <TextField
                id="outlined"
                variant="outlined"
                type="date"
                value={editTanggal}
                onChange={(e) => setEditTanggal(e.target.value)}
              />
            </FormControl>

            <div
              style={{
                marginTop: "40px",
                marginBottom: "40px",
                width: "100%",
                height: "1px",
                backgroundColor: "black",
              }}
            ></div>

            <p
              style={{
                marginBottom: 30,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Soal Pilihan Ganda
            </p>

            {editQuestions.map((question, qIndex) => (
              <div key={qIndex}>
                <p style={{ marginBottom: 20 }}>Soal nomor-{qIndex + 1}</p>
                <FormControl fullWidth style={{}}>
                  <TextField
                    sx={{
                      width: "100%",
                      marginBottom: "20px",
                    }}
                    defaultValue={question.soal || ""}
                    label={`Soal No-${qIndex + 1}`}
                    variant="outlined"
                    onChange={(e) => {
                      editQuestions[qIndex].soal = e.target.value;
                      // Handle text change
                    }}
                  />
                </FormControl>
                {["A", "B", "C", "D", "E"].map((choiceLabel, cIndex) => {
                  const inputTypeKey = `${qIndex}-${cIndex}`;
                  const isImageInput =
                    choiceInputType[inputTypeKey] === "image";
                  return (
                    <div key={cIndex}>
                      <TextField
                        sx={{
                          width: "100%",
                          marginTop: "5px",
                          marginBottom: "5px",
                        }}
                        defaultValue={
                          editQuestions[qIndex].pilihan[cIndex][1] ?? ""
                        }
                        label={`Pilihan ${choiceLabel}`}
                        variant="outlined"
                        onChange={(e) => {
                          // Handle text change
                          const updatedQuestions = [...editQuestions];
                          updatedQuestions[qIndex].pilihan[cIndex][1] =
                            e.target.value;
                          setEditQuestions(updatedQuestions);
                        }}
                      />
                    </div>
                  );
                })}
                <FormControl fullWidth style={{}}>
                  <TextField
                    sx={{
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    defaultValue={question.jawaban || ""}
                    label={`Jawaban No-${qIndex + 1}`}
                    variant="outlined"
                    onChange={(e) => {
                      questions[qIndex].jawaban = e.target.value;
                      // Handle text change
                    }}
                  />
                </FormControl>
              </div>
            ))}
            <Button
              style={{ marginTop: "20px" }}
              variant="contained"
              onClick={() => {
                if (questions.length === 0) {
                  setEditQuestions([
                    ...questions,
                    {
                      id_soal: 1,
                      soal: "",
                      pilihan: Array(5)
                        .fill({})
                        .map((_, i) => ({
                          ["jenis_pilihan[" + i + "]"]: String.fromCharCode(
                            65 + i
                          ),
                          ["isi_pilihan[" + i + "]"]: "",
                        })),
                      jawaban: "",
                    },
                  ]);
                } else {
                  if (questions[questions.length - 1].soal === "") {
                    toast.error("Soal tidak boleh kosong!");
                    return;
                  } else if (questions[questions.length - 1].jawaban === "") {
                    toast.error("Jawaban tidak boleh kosong!");
                    return;
                  } else {
                    // console.log(questions);
                    setEditQuestions([
                      ...questions,
                      {
                        id_soal:
                          editQuestions.length === 0
                            ? editQuestions.length + 1
                            : 1,
                        soal: "",
                        pilihan: Array(5)
                          .fill({})
                          .map((_, i) => ({
                            ["jenis_pilihan[" + i + "]"]: String.fromCharCode(
                              65 + i
                            ),
                            ["isi_pilihan[" + i + "]"]: "",
                          })),
                        jawaban: "",
                      },
                    ]);
                  }
                }
              }}
            >
              Tambah Soal Pilihan Ganda
            </Button>

            <div
              style={{
                marginTop: "40px",
                marginBottom: "20px",
                width: "100%",
                height: "1px",
                backgroundColor: "black",
              }}
            ></div>

            {questions.length > 1 && (
              <Button
                style={{ marginTop: "20px" }}
                variant="contained"
                color="error"
                onClick={() => {
                  setEditQuestions(
                    [...questions].slice(0, questions.length - 1)
                  );
                }}
              >
                Hapus 1 Soal Pilihan Ganda
              </Button>
            )}
            <FormControlLabel
              sx={{ marginTop: "50px", marginBottom: "10px" }}
              control={
                <Switch
                  checked={showEssayRecreate}
                  onChange={() => {
                    setShowEssayRecreate(!showEssayRecreate);
                  }}
                />
              }
              label="Tampilkan Input Essay"
            />
            <p
              style={{
                marginBottom: "20px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Soal Essay
            </p>
            {showEssayRecreate && (
              <>
                {editEssay.map((s, eIndex) => (
                  <>
                    <div style={{}} key={eIndex}>
                      <p style={{ marginBottom: "20px", marginTop: "20px" }}>
                        Soal Essay nomor-{eIndex + 1}
                      </p>
                      <FormControl fullWidth>
                        <TextField
                          defaultValue={editEssay[eIndex].soal || ""}
                          label={`Soal Essay - ${eIndex + 1}`}
                          variant="outlined"
                          sx={{ marginTop: "15px" }}
                          onChange={(e) => {
                            const updatedEssay = [...editEssay];
                            updatedEssay[eIndex].soal = e.target.value;
                            setEditEssay(updatedEssay);
                          }}
                        />
                        <TextField
                          defaultValue={editEssay[eIndex].jawaban || ""}
                          label={`Jawaban Essay - ${eIndex + 1}`}
                          onChange={(e) => {
                            const updatedEssay = [...editEssay];
                            updatedEssay[eIndex].jawaban = e.target.value;
                            setEditEssay(updatedEssay);
                          }}
                          variant="outlined"
                          sx={{ marginTop: "15px", marginBottom: "15px" }}
                        />
                      </FormControl>
                    </div>
                  </>
                ))}
                <>
                  <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    onClick={() => {
                      setEditEssay([
                        ...editEssay,
                        {
                          id_soal: editEssay.length + 1,
                          soal: "",
                          jawaban: "",
                        },
                      ]);
                    }}
                  >
                    Tambah Soal Essay
                  </Button>
                </>
                {editEssay.length > 1 ? (
                  <Button
                    style={{ marginTop: "20px" }}
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (essay.length === 1) {
                        // setShowEssayRecreate(false)
                        setEditEssay(
                          [...editEssay].slice(0, editEssay.length - 1)
                        );
                      } else {
                        setEditEssay(
                          [...editEssay].slice(0, editEssay.length - 1)
                        );
                      }
                    }}
                  >
                    Hapus 1 Soal Essay
                  </Button>
                ) : (
                  <div></div>
                )}
              </>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "100px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  if (editEssay.length === 0) {
                    setShowModalEdit(false);
                  }
                  onHideModalEdit();
                }}
              >
                Close Form
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (editId === undefined || editId === null) {
                    toast.error("Id Tidak ditemukan");
                  } else {
                    editUjian(editId);
                  }
                }}
              >
                Submit Data
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* End Modal Edit Ujian*/}

      {isTabletOrMobile ? (
        <div style={{ width: "100vh", textAlign: "center" }}>
          Tidak Support untuk Mobile
        </div>
      ) : (
        <div>
          <TableContainer
            sx={{ marginTop: 5, display: hideModalTrigger ? "none" : "block" }}
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
                    Jenis Ujian
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Kelas
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Tanggal
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Pelajaran
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Jam Mulai
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Total Soal
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
                {dataUjian.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {i + 1}
                    </TableCell>
                    <TableCell align="center">{row.nama_ujian}</TableCell>
                    <TableCell align="center">
                      {row.kelas.nomor_kelas}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(row.tanggal).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">{row.pelajaran.nama}</TableCell>
                    <TableCell align="center">{row.jam_mulai}</TableCell>
                    <TableCell align="center">{row.total_soal}</TableCell>
                    <TableCell align="center">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        className="btn_absen"
                        sx={{
                          marginTop: 1,
                          marginRight: 1,
                          width: "100%",
                        }}
                        variant="contained"
                        onClick={async () => {
                          await getPelajaran();
                          getEditUjian(row.ujian_id);
                          setEditTypeUjian(row.nama_ujian);
                          if (row.durasi === null) {
                            toast.error("Durasi Kosong - Check Database");
                          } else {
                            setEditDurasi(row.durasi);
                          }
                          if (row.jam_mulai === null) {
                            toast.error("Jam Mulai Kosong - Check Database");
                          } else if (!row.jam_mulai.includes(".00")) {
                            toast.error(
                              "Jam Mulai Tidak Valid - Check Database"
                            );
                          } else {
                            setEditJamMulai(
                              row.jam_mulai.split("")[0] +
                              row.jam_mulai.split("")[1]
                            );
                          }
                          if (row.tanggal === null) {
                            toast.error("Tanggal Kosong - Check Database");
                          } else {
                            setEditTanggal(formatDate(new Date(row.tanggal)));
                          }
                          if (row.pelajaran_id === null) {
                            toast.error("Pelajaran Kosong - Check Database");
                          } else {
                            setEditSelectedPelajaran(row.pelajaran_id);
                          }
                          if (row.keterangan === null) {
                            toast.error("Keterangan Kosong - Check Database");
                          } else {
                            setEditKeterangan(row.keterangan);
                          }
                          if (row.semester === null) {
                            toast.error("Semester Kosong - Check Database");
                          } else {
                            setEditSemester(row.semester);
                          }
                          setEditId(row.ujian_id);
                          setModalRecreate(true);
                        }}
                      >
                        Buat Ulang
                      </Button>
                      <Button
                        className="btn_absen"
                        sx={{
                          marginTop: 1,
                          width: "100%",
                        }}
                        variant="contained"
                        onClick={async () => {
                          await getPelajaran();
                          getEditUjian(row.ujian_id);
                          setEditTypeUjian(row.nama_ujian);
                          if (row.durasi === null) {
                            toast.error("Durasi Kosong - Check Database");
                          } else {
                            setEditDurasi(row.durasi);
                          }
                          if (row.jam_mulai === null) {
                            toast.error("Jam Mulai Kosong - Check Database");
                          } else if (!row.jam_mulai.includes(".00")) {
                            toast.error(
                              "Jam Mulai Tidak Valid - Check Database"
                            );
                          } else {
                            setEditJamMulai(
                              row.jam_mulai.split("")[0] +
                              row.jam_mulai.split("")[1]
                            );
                          }
                          if (row.tanggal === null) {
                            toast.error("Tanggal Kosong - Check Database");
                          } else {
                            setEditTanggal(formatDate(new Date(row.tanggal)));
                          }
                          if (row.pelajaran_id === null) {
                            toast.error("Pelajaran Kosong - Check Database");
                          } else {
                            setEditSelectedPelajaran(row.pelajaran_id);
                          }
                          if (row.keterangan === null) {
                            toast.error("Keterangan Kosong - Check Database");
                          } else {
                            setEditKeterangan(row.keterangan);
                          }
                          if (row.semester === null) {
                            toast.error("Semester Kosong - Check Database");
                          } else {
                            setEditSemester(row.semester);
                          }
                          setEditId(row.ujian_id);
                          setShowModalEdit(true);
                        }}
                      >
                        Ubah Data
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {dataUjian.length === 0 && (
            <TableContainer
              sx={{
                marginTop: 10,
                display: hideModalTrigger ? "block" : "none",
              }}
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
                      User Id
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Jawaban PG
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Jawaban Essay
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Ujian Id
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
                  {answerUser.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {i + 1}
                      </TableCell>
                      <TableCell align="center">{row.user_id}</TableCell>
                      <TableCell align="center">
                        {JSON.parse(row.jawaban_pg)}
                      </TableCell>
                      <TableCell align="center">
                        {JSON.parse(row.jawaban_essay)}
                      </TableCell>
                      <TableCell align="center">{row.ujian_id}</TableCell>
                      <TableCell align="center">{row.total_benar}</TableCell>
                      <TableCell align="center">{row.total_salah}</TableCell>
                      <TableCell align="center">
                        {new Date(row.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          className="btn_absen"
                          sx={{
                            marginTop: 1,
                          }}
                          variant="contained"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
    </>
  );
}
