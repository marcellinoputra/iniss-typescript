import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./navigator/router.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
