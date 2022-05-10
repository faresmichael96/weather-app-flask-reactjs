import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Register() {

    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorValidationMessage, setErrorValidationMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [allCountries, setAllCountries] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        axios({
            url: '/get-countries',
            method: 'get'
        })
            .then(res => {
                setAllCountries(res.data);
            })
    }, [])

    const submitSignUp = (e) => {
        e.preventDefault();
        setErrorValidationMessage('');
        setLoading(true);
        axios({
            url: '/register',
            method: 'post',
            data: {
                fullName: fullName,
                country: country,
                username: username,
                password: password
            }
        })
            .then(res => {
                if (res.data.success) {
                    navigate('/login');
                }
            })
            .catch(res => {
                setLoading(false);
                setErrorValidationMessage(res.response.data.message);
            })
    }

    return (
        <div className="page-wrapper login">
            {
                loading && (
                    <Loader loading={loading} />
                )
            }
            <div className="top">
                <h1>Register</h1>
            </div>

            <h1 className="have-account">Already have an account? <Link to="/login" className="login" style={{ textDecoration: 'none' }}>Login</Link></h1>
            {
                errorValidationMessage ?
                    <p className="error">{errorValidationMessage}</p>
                    :
                    null
            }
            <form onSubmit={submitSignUp} noValidate>
                <input type="text" name="full_name" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
                <select name="country" value={country} placeholder="Please choose a country" onChange={(e) => setCountry(e.target.value)}>
                    <option disabled>Please choose a country</option>
                    {
                        allCountries?.map((singleCountry, index) => (
                            <option value={singleCountry.name} key={index}>{singleCountry.name}</option>
                        ))
                    }
                </select>
                <input type="text" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}