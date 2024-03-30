import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { Diversity3TwoTone, Person } from "@mui/icons-material";
import axios from "axios";
import axiosNew from "../components/AxiosConfig";
import cryptoJS from "crypto-js";

export default function Home() {
  const [murid, setMurid] = useState([]);
  const [guru, setGuru] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    function getDataUser() {
      const decrypt = cryptoJS.AES.decrypt(
        token,
        `${import.meta.env.VITE_KEY_ENCRYPT}`
      );
      axiosNew
        .get("/list-users", {
          headers: {
            "x-access-token": token,
            "ngrok-skip-browser-warning": "any",
          },
        })
        .then(function (res) {
          setMurid(res.data.data);
        });
    }
    function getGuru() {
      axiosNew.get("/guru").then(function (res) {
        setGuru(res.data.data);
      });
    }
    getDataUser();
    getGuru();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <Card sx={{ maxWidth: 300 }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <Diversity3TwoTone
                sx={{
                  fontSize: 40,
                  marginRight: 7,
                }}
              />
              <div>
                <span
                  style={{
                    fontWeight: "400",
                  }}
                >
                  {murid.length}
                </span>
                <Typography variant="body2" color="text.secondary">
                  Total Murid
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card sx={{ maxWidth: 300, marginLeft: 5 }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <Diversity3TwoTone
                sx={{
                  fontSize: 40,
                  marginRight: 7,
                }}
              />
              <div>
                <span
                  style={{
                    fontWeight: "400",
                  }}
                >
                  {guru.length}
                </span>
                <Typography variant="body2" color="text.secondary">
                  Total Guru
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
