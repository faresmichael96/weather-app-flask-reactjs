import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import GlobalState from "../contexts/GlobalState";

export default function Login() {

    const { authenticatedUser, setAuthenticatedUser } = useContext(GlobalState);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorValidationMessage, setErrorValidationMessage] = useState('');
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

    const submitLogin = (e) => {
        e.preventDefault();
        setErrorValidationMessage('');
        setLoading(true);
        axios({
            url: '/login',
            method: 'post',
            data: {
                username: username,
                password: password
            }
        })
            .then(res => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
                localStorage.setItem('auth_token', 'Bearer ' + res.data.token);
                let user = JSON.parse(res.data.user);
                setAuthenticatedUser(user[0]);
                navigate("/dashboard");
            })
            .catch(res => {
                setUsername('');
                setPassword('');
                setLoading(false);
                setErrorValidationMessage(res.response.data.message);
            })
    };

    return (
        <div className="page-wrapper login">
            {
                loading && (
                    <Loader loading={loading} />
                )
            }
            <div className="top">
                <h1>login</h1>
                <p>Login to your account.</p>
            </div>

            <h1 className="no-account">Don't have an account? <Link to="/register" className="register">Register</Link></h1>
            {
                errorValidationMessage ?
                    <p className="error">{errorValidationMessage}</p>
                    :
                    null
            }
            <form onSubmit={submitLogin} noValidate>
                <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}