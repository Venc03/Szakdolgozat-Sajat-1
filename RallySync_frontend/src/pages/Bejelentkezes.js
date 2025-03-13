import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap"; // Import Spinner from React Bootstrap

export default function Bejelentkezes() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Track loading state
    const { loginReg, errors } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const adat = {
            email,
            password,
        };

        setLoading(true); // Set loading to true when the request starts
        await loginReg(adat, "login");
        setLoading(false); // Set loading to false when the request ends

        // Redirect if successful (navigate only if no errors)
        if (!errors) {
            navigate("/dashboard"); // Or wherever you want to redirect on success
        }
    };

    return (
        <div className="m-auto" style={{ maxWidth: "400px" }}>
            <h1 className="text-center">Bejelentkezés</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        id="email"
                        placeholder="email"
                    />
                    {errors?.email && <span className="text-danger">{errors.email[0]}</span>}
                </div>

                <div className="mb-3">
                    <label htmlFor="pwd" className="form-label">Jelszó:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        id="pwd"
                        placeholder="jelszó"
                    />
                    {errors?.password && <span className="text-danger">{errors.password[0]}</span>}
                </div>

                {errors?.general && <span className="text-danger">{errors.general}</span>}

                <div className="text-center">
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <Spinner animation="border" size="sm" /> // Show spinner if loading
                        ) : (
                            "Belépés"
                        )}
                    </button>

                    <p>
                        Még nincs fiókja?
                        <Link to="/regisztracio" className="nav-link text-info">
                            Regisztráció
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
