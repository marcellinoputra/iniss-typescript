import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import Mapel from "../pages/Mapel";
import axiosNew from "./AxiosConfig";
import {
  AccountBox,
  Book,
  BookOutlined,
  Event,
  House,
} from "@mui/icons-material";
import Users from "../pages/Users";
import Nilai from "../pages/Nilai";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import Ujian from "../pages/Ujian";
import AdminGuru from "../pages/Admin/AdminGuru";
import {
  useChangeNavbarAdmin,
  useMenuAdmin,
  useToggleSidebarAdmin,
} from "../store/admin/admin_home.store";
import { useRefresh, useToken } from "../store/global_store";
import AdminKelas from "../pages/Admin/AdminKelas";
import AdminSiswa from "../pages/Admin/AdminSiswa";
import AdminMapel from "../pages/Admin/AdminMapel";

function DrawerAdmin(props) {
  // Store
  const menuStore = useMenuAdmin((state) => state.menuAdmin);
  const checkAuth = useRefresh((state) => state);
  const toggle = useToggleSidebarAdmin((state) => state);
  const changeNavbar = useChangeNavbarAdmin((state) => state);
  const checkRole = useRefresh((state) => state);

  const navigate = useNavigate();
  const location = useLocation();
  const { window } = props;
  const drawerWidth = 240;

  useEffect(() => {
    checkRole.checkNavigateRole(navigate);
  }, []);

  useEffect(() => {
    checkAuth.check();
    changeNavbar.changeNavbars(location);
  }, [location]);

  function onChangeNavSpesific(id) {
    changeNavbar.changeNavbars(id);
    if (id === 0) {
      navigate("/admin");
    } else if (id === 1) {
      navigate("/admin/guru-adm");
    } else if (id === 2) {
      navigate("/admin/murid-adm");
    } else if (id === 3) {
      navigate("/admin/mapel-adm");
    } else if (id === 4) {
      navigate("/admin/kelas-adm");
    } else if (id === 5) {
      navigate("/admin/admins-adm");
    }
  }

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
        {menuStore.map((text, index) => (
          <div key={text.id} className="last:mb-0 mb-2">
            <div
              className={`${
                changeNavbar.changeNav == index
                  ? "bg-white text-black"
                  : "text-white"
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
                className={`flex-shrink-0 ${
                  changeNavbar.changeNav == index ? "text-black" : "text-white"
                }`}
              >
                {index == 0 ? <House /> : null}
                {index == 1 ? <Book /> : null}
                {index == 2 ? <Event /> : null}
                {index == 3 ? <BookOutlined /> : null}
                {index == 4 ? <AccountBox /> : null}
                {index == 5 ? <Book /> : null}
              </div>
              <span className="ml-3">{text.name}</span>
            </div>
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
            onClick={toggle.setMobileOpen}
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
                {useRefresh.getState().nama ?? "Kosong"}
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
          open={toggle.mobileOpen}
          onClose={toggle.setMobileOpen}
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
        {/* Ini Diubah untuk connect ke page */}
        {location.pathname === "/" ? <Home /> : null}
        {location.pathname === "/admin/guru-adm" ? <AdminGuru /> : null}
        {location.pathname === "/admin/murid-adm" ? <AdminSiswa /> : null}
        {location.pathname === "/admin/mapel-adm" ? <AdminMapel /> : null}
        {location.pathname === "/admin/kelas-adm" ? <AdminKelas /> : null}
        {location.pathname === "/admin/admins-adm" ? <Ujian /> : null}
      </Box>
    </Box>
  );
}

DrawerAdmin.propTypes = {
  window: PropTypes.func,
};

export default DrawerAdmin;
