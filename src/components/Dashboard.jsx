import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, Grid } from "@mui/material";
const drawerWidth = 240;
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Absensi from "../pages/Absensi";
import Guru from "../pages/Guru";
import Home from "../pages/Home";
import imgIcon from "../assets/icon.jpg";
import Mapel from "../pages/Mapel";
import axiosNew from "./AxiosConfig";
import {
  AccountBox,
  Book,
  BookOutlined,
  Event,
  House,
  Logout,
  PermIdentity,
  School,
  Star,
} from "@mui/icons-material";
import Users from "../pages/Users";
import Nilai from "../pages/Nilai";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import Ujian from "../pages/Ujian";
import HasilUlangan from "../pages/HasilUlangan";
import { useRefresh } from "../store/global_store";

function ResponsiveDrawer(props) {
  // State
  const checkRole = useRefresh((state) => state);


  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [changeNav, setChangeNav] = useState(0);
  const [changeMenuName, setChangeMenuName] = useState("");
  const location = useLocation();
  const [roleId, setRoleId] = useState();
  const [menu, setMenu] = useState([
    {
      id: 0,
      name: "Home",
      url: "/",
    },
    // {
    //   id: 2,
    //   name: "Guru",
    //   url: "/guru",
    // },
    // {
    //   id: 3,
    //   name: "Absensi",
    //   url: "/absensi",
    // },
    {
      id: 1,
      name: "Mata Pelajaran",
      url: "/mapel",
    },
    // {
    //   id: 5,
    //   name: "Users",
    //   url: "/users",
    // },
    // {
    //   id: 6,
    //   name: "Nilai",
    //   url: "/nilai"
    // },
    {
      id: 2,
      name: "Ujian",
      url: "/ujian",
    },
    {
      id: 3,
      name: "Hasil Ulangan Siswa",
      url: "/hasil-ulangan-siswa",
    },
  ]);

  useEffect(() => {
    async function fetchDataRefresh() {
      if (token === null || token === undefined) {
        navigate("/sign-in");
        localStorage.removeItem("token");
      } else {
        await axiosNew
          .get("/refresh-token", {
            headers: {
              "x-access-token": token,
              "ngrok-skip-browser-warning": "any",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setData(res.data.data);
              // fetchRole(res.data.data.role)
            }
          })
          .catch((err) => {
            if (err.response.status === 400) {
              navigate("/sign-in");
              localStorage.removeItem("token");
            }
          });
      }
    }
    fromPathSpesific();
    fetchDataRefresh();
  }, [location]);

  useEffect(() => {
    checkRole.checkNavigateRole(navigate)
  }, [])

  function onChangeNav(id) {
    setChangeNav(id);
    if (id === 2) {
      navigate("/guru");
    } else if (id === 1) {
      navigate("/");
    } else if (id === 3) {
      navigate("/absensi");
    } else if (id === 4) {
      navigate("/mapel");
    } else if (id === 5) {
      navigate("/users");
    } else if (id === 6) {
      navigate("/nilai");
    } else if (id === 7) {
      navigate("/ujian");
    } else if (id === 8) {
      navigate("/hasil-ulangan-siswa");
    }
  }

  function onChangeNavSpesific(id) {
    // // console.log(`ID -> ${id}`);
    setChangeNav(id);
    if (id === 0) {
      navigate("/");
    } else if (id === 1) {
      navigate("/mapel");
    } else if (id === 2) {
      navigate("/ujian");
    } else if (id === 3) {
      navigate("/hasil-ulangan-siswa");
    }
  }

  function fromPath() {
    if (location.pathname === "/") {
      setChangeNav(1);
    } else if (location.pathname === "/guru") {
      setChangeNav(2);
    } else if (location.pathname === "/absensi") {
      setChangeNav(3);
    } else if (location.pathname === "/mapel") {
      setChangeNav(4);
    } else if (location.pathname === "/users") {
      setChangeNav(5);
    } else if (location.pathname === "/nilai") {
      setChangeNav(6);
    } else if (location.pathname === "/ujian") {
      setChangeNav(7);
    }
  }

  function fromPathSpesific() {
    if (location.pathname === "/") {
      setChangeNav(0);
    } else if (location.pathname === "/mapel") {
      setChangeNav(1);
    } else if (location.pathname === "/ujian") {
      setChangeNav(2);
    } else if (location.pathname === "/hasil-ulangan-siswa") {
      setChangeNav(3);
    }
  }

  function iconByName(name) {
    if (name === "Guru") {
      return <AccountBox className="h-5 w-5" />;
    } else if (name === "Absensi") {
      return <Book className="h-5 w-5" />;
    } else if (name === "Ujian") {
      return <School className="h-5 w-5" />;
    } else if (name === "Nilai") {
      return <School className="h-5 w-5" />;
    } else if (name === "Users") {
      return <Star className="h-5 w-5" />;
    } else if (name === "Mapel") {
      return <AccountBox className="h-5 w-5" />;
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <p
        style={{
          textAlign: "center",
          color: "white",
          marginTop: "60px",
          fontSize: 42,
        }}
      >
        INISS
      </p>
      <p
        style={{
          textAlign: "center",
          color: "white",
          fontSize: 10,
        }}
      >
        (Intelligentsia Nurul Ilmi Secondary School)
      </p>
      <List
        sx={{
          marginTop: "66px",
        }}
      >
        {menu.map((text, index) => (
          <div key={text.id} className="last:mb-0 mb-2">
            <div
              className={`${changeNav === index ? "bg-white text-black" : "text-white"
                }`}
              onClick={() => onChangeNavSpesific(index)}
              style={{
                padding: 10,
                margin: 8,
                marginBottom: 8,
                borderRadius: 10,
                gap: 10,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div
                className={`flex-shrink-0 ${changeNav === index ? "text-black" : "text-white"
                  }`}
              >
                {index == 0 ? <House /> : null}
                {index == 1 ? <Book /> : null}
                {index == 2 ? <Event /> : null}
                {index == 3 ? <BookOutlined /> : null}
                {index == 4 ? <AccountBox /> : null}
                {/* Icon For Nilai */}
                {index == 5 ? <Book /> : null}
                {index == 6 ? <Book /> : null}
              </div>
              <span className="ml-3">{text.name}</span>
            </div>
            {/* {index < menu.length && <hr className="border-t border-gray-200" />} */}
          </div>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          boxShadow: "0 4px 5px -6px #222",
          backgroundColor: "#FFFFFF",
          color: "black",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              style={{
                fontSize: 20,
              }}
            >
              Dashboard
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  marginRight: 10,
                }}
              >
                {data.nama}
              </span>
              <Profile />
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#182237",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          PaperProps={{
            sx: {
              backgroundColor: "#182237",
              color: "white",
            },
          }}
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          backgroundColor: "#F4F6F9",
          height: "100vh",
          overflow: "auto",
          padding: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {location.pathname === "/" ? <Home /> : null}
        {/* {location.pathname === "/guru" ? <Guru /> : null} */}
        {location.pathname === "/absensi" ? <Absensi /> : null}
        {location.pathname === "/mapel" ? <Mapel /> : null}
        {location.pathname === "/users" ? <Users /> : null}
        {location.pathname === "/nilai" ? <Nilai /> : null}
        {location.pathname === "/ujian" ? <Ujian /> : null}
        {location.pathname === "/hasil-ulangan-siswa" ? <HasilUlangan /> : null}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
