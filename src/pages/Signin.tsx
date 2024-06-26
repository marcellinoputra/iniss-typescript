import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../store/auth.store";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUsername, setRememberUsername] = useState(false);
  const [role, setRole] = useState("guru");

  const authStore = useAuth((state) => state);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberUsername(true);
    }
  }, []);

  const handleSubmit = async (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    if (rememberUsername) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    if (role === "guru") {
      authStore.signInGuru(username, password);
    } else if (role === "admin") {
      authStore.signInAdmin(username, password);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />

      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Masuk Dashboard
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                         block w-full rounded-md focus:ring-indigo-500"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                         block w-full rounded-md focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">Login Sebagai</label>
            <select
              value={role ?? "guru"}
              onChange={(e) => setRole(e.target.value)}
              name="role"
              id="role"
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                         block w-full rounded-md focus:ring-indigo-500"
            >
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={rememberUsername}
                onChange={(e) => setRememberUsername(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-600">Ingat Username</span>
            </label>
          </div>

          {/* <p className="mb-5">
            Tidak punya akun?
            <a href='#'
              onClick={() => {
                router.navigate('/sign-up');
              }}
              className='font-bold text-indigo-500 hover:cursor-pointer'
            >
              Daftar
            </a>
          </p> */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm text-white bg-indigo-600 rounded-md 
                       focus:bg-indigo-700 focus:outline-none"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
