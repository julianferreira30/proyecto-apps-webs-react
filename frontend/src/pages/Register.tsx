import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { registerUser, setError } from "../reducers/userReducer";
import { validateInputString } from "../utils/validations";
import { Fade } from "@mui/material";

const Register = () => {
    // Store
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector((state: RootState) => state.user.error)


    // Estados locales y navegación
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");


    // Errores
    const nameError = name.trim().length > 50;
    const usernameError = username.trim().length > 30;
    const passwordError = password.trim().length > 30;
    const pattern = /^https?:\/\/.*\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i;
    const urlError = profileImage.trim() ? !pattern.test(profileImage.trim()) : false;
    const urlLenError = profileImage.trim().length > 300;


    // Submit user
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setError(null))
        if (password !== confirmPassword) {
            dispatch(setError("Las contraseñas no coinciden"));
            setTimeout(() => {
                dispatch(setError(null));
            }, 10000);
            return;
        }
        if (!validateInputString(name, 1, 50) ||
            !validateInputString(username, 5, 30) ||
            !validateInputString(password, 8, 30)) {
            dispatch(setError("Asegúrate de llenar al menos los campos requeridos de la forma correcta"));
            setTimeout(() => {
                dispatch(setError(null));
            }, 10000);
            return;
        }
        dispatch(registerUser({profile_image: profileImage, username, name, password}))
        setName("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setProfileImage("");
        navigate("/")
    };

    return (
        <div className="register">
        <Box className="register-box">
            <h1 className="register-title">Crear cuenta</h1>

            <form onSubmit={handleSubmit} className="register-form">

                <TextField
                    className="register-textfield"
                    label="Nombre"
                    variant="filled"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                />
                {nameError && (
                    <Fade in={!!nameError} timeout={1000}>
                        <span className="error-register">
                        El nombre debe tener menos de 50 caracteres
                        </span>
                    </Fade>
                )}

                <TextField
                    className="register-textfield"
                    label="Nombre de usuario (mínimo 5 caracteres)"
                    variant="filled"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                    <Fade in={!!usernameError} timeout={1000}>
                        <span className="error-register">
                        El nombre de usuario debe tener menos de 30 caracteres
                        </span>
                    </Fade>
                )}

                <TextField
                    className="register-textfield"
                    label="Contraseña (mínimo 8 caracteres)"
                    variant="filled"
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                    <Fade in={!!passwordError} timeout={1000}>
                        <span className="error-register">
                        La contraseña debe tener menos de 30 caracteres
                        </span>
                    </Fade>
                )}

                <TextField
                    className="register-textfield"
                    label="Confirmar contraseña"
                    variant="filled"
                    type="password"
                    value={confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <TextField
                    className="register-textfield"
                    label="Url foto de Perfil"
                    variant="filled"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                />
                {urlError && (
                    <Fade in={!!urlError} timeout={1000}>
                        <span className="error-register">
                        Asegúrate de que la url comience con http:// o https:// y termine con una extensión de imagen como .jpg, .png, .gif, etc.
                        </span>
                    </Fade>
                )}
                {urlLenError && (
                    <Fade in={!!urlLenError} timeout={1000}>
                        <span className="error-register">
                        La url debe tener menos de 300 caracteres
                        </span>
                    </Fade>
                )}

                <div className="register-submit-container">
                    <Button
                        type="submit"
                        variant="contained"
                        className="register-submit"
                    >
                        Registrarse
                    </Button>
                </div>
                {error && 
                    <Fade in={!!error} timeout={1000}>
                    <span className="error-register">
                        {error}
                    </span>
                    </Fade>}
            </form>
        </Box>
        </div>
    )
};

export default Register;