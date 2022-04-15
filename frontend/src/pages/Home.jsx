import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {

    const [data, setData] = useState();

    // useEffect(() => {
    //     axios.get('/data')
    //         .then(function (response) {
    //             // handle success
    //             console.log(response.data);
    //         })
    //         .catch(function (error) {
    //             // handle error
    //             console.log(error.data);
    //         })
    //         .then(function () {
    //             // always executed
    //         });
    // }, []);

    return (
        <div>
            <h1>Weather App</h1>
            <p>welcome to the weather app.</p>
            <Link to="/login" style={{display: "block"}}>Login</Link>
            <Link to="/register">Register</Link>
        </div>
    )
}