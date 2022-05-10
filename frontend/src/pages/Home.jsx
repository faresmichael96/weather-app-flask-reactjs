import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {

    const [data, setData] = useState();

    return (
        <div>
            <div className="page-wrapper home">
                <h1>Weather App</h1>
                <h2>Welcome to the weather app.</h2>
                <div className="actions">
                    <Link to="/login" className="btn" style={{ display: "block" }}>Login</Link>
                    <Link to="/register" className="btn">Register</Link>
                </div>
            </div>
        </div>
    )
}