import React, { useState } from "react";
import { router } from "../navigator/router";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../store/auth.store";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [isPassword, setIsPassword] = useState(false)
  // const [role, setRole] = useState(1)

  const authStore = useAuth((state) => state);

  const handleSubmit = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    authStore.signUpAccount(name, username, password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Daftar Akun
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                         block w-full rounded-md focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                         block w-full rounded-md focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 
                         placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                         block w-full rounded-md focus:ring-indigo-500"
            />
          </div>
          <p className="mb-5">
            Sudah Mempunyai akun?{" "}
            <a
              onClick={() => {
                router.navigate("/sign-in", { replace: true });
              }}
              className="font-bold text-indigo-500 hover:cursor-pointer"
            >
              Masuk
            </a>
          </p>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm text-white bg-indigo-600 rounded-md 
                       focus:bg-indigo-700 focus:outline-none"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
