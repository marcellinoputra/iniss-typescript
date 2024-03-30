import React from 'react'
import Lottie from "lottie-react";
import notfound from "../assets/lottie.json";

export default function ErrorNotFound() {
    return (
        <div>
            <p className="text-center text-3xl font-bold mt-5">404 Not Found</p>
            <Lottie animationData={notfound} style={{
                width: "100%",
                height: "100%",
                position: "fixed",
                top: 0,
                left: 0,
            }} />
        </div>

    )
}
