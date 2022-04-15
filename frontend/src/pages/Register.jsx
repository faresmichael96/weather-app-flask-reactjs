import React, { useState } from "react";
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

    let navigate = useNavigate();

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
                <p>create your account.</p>
            </div>

            <h1 className="have-account">Already have an account? <Link to="/login">Login</Link></h1>
            {
                errorValidationMessage ?
                    <p className="error">{errorValidationMessage}</p>
                    :
                    null
            }
            <form onSubmit={submitSignUp} noValidate>
                <input type="text" name="full_name" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
                <input type="text" name="country" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
                <input type="text" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}