import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Guru from "../pages/Guru";
import Absensi from "../pages/Absensi.jsx";
import Mapel from "../pages/Mapel.jsx";
import Users from "../pages/Users.jsx";
import Nilai from "../pages/Nilai.jsx";
import Ujian from "../pages/Ujian.jsx";
import SignUp from "../pages/SignUp.jsx";
import Signin from "../pages/Signin.jsx";
import ErrorNotFound from "../pages/ErrorNotFound.jsx";
import axiosNew from "../components/AxiosConfig.jsx";
import HasilUlangan from "../pages/HasilUlangan.jsx";
import AppAdmin from "../AppAdmin.jsx";
import AdminGuru from "../pages/Admin/AdminGuru.jsx";
import AdminKelas from "../pages/Admin/AdminKelas.jsx";
import AdminSiswa from "../pages/Admin/AdminSiswa.jsx";
import AdminMapel from "../pages/Admin/AdminMapel.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "guru",
        element: <Guru />,
      },
      {
        path: "mapel",
        element: <Mapel />,
      },
      {
        path: "absensi",
        element: <Absensi />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "nilai",
        element: <Nilai />,
      },
      {
        path: "ujian",
        element: <Ujian />,
      },
      {
        path: "hasil-ulangan-siswa",
        element: <HasilUlangan />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AppAdmin />,
    children: [
      {
        path: "guru-adm",
        element: <AdminGuru />,
      },
      {
        path: "kelas-adm",
        element: <AdminKelas />,
      },
      {
        path: "murid-adm",
        element: <AdminSiswa />,
      },
      {
        path: "mapel-adm",
        element: <AdminMapel />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <Signin />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <ErrorNotFound />,
  },
]);
