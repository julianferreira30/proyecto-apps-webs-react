import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { registerUser, setError } from "../reducers/userReducer";


const Register = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const error = useSelector((state: RootState) => state.user.error)

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setError(null))
        if (password !== confirmPassword) {
            dispatch(setError("Las contraseñas no coinciden"));
            return;
        }
        dispatch(registerUser({profile_image: profileImage, username, name, password}))
        navigate("/")
    };

    return (
        <div style={{display:"flex", justifyContent:"center"}}>
        <Box sx={{alignItems:"center", 
            display:"flex", 
            flexDirection:"column", 
            marginTop:"80px", 
            width: "400px", 
            paddingBottom:"30px", 
            justifyContent:"center", 
            backgroundColor:"#14152A",
            borderColor: "white",
            borderRadius:"10px",
            boxShadow:"0 0 20px rgba(1, 200, 24, 0.5)"}}>
            <h1>Crear cuenta</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px", justifyContent:"center", alignItems:"center" }}>
                <TextField 
                label="Nombre" 
                variant="outlined" 
                value={name} 
                required
                onChange={(e) => setName(e.target.value)}
                sx={{
                    input: { color: "white", fontSize: "1.2rem" },
                    label: { color: "white", fontSize: "1rem", "&.Mui-focused": { color: "white" } },
                    borderColor: "#353752", 
                    backgroundColor: "#353752",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent:"center"
                }}/>

                <TextField 
                label="Nombre de usuario" 
                variant="outlined" 
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                    input: { color: "white", fontSize: "1.2rem" },
                    label: { color: "white", fontSize: "1rem", "&.Mui-focused": { color: "white" } },
                    borderColor: "#353752", 
                    backgroundColor: "#353752",
                    borderRadius: "5px",
                    display: "flex"
                }}/>

                <TextField 
                label="Contraseña" 
                variant="outlined" 
                value={password} 
                required
                onChange={(e) => setPassword(e.target.value)} 
                type="password"
                sx={{
                    input: { color: "white", fontSize: "1.2rem" },
                    label: { color: "white", fontSize: "1rem", "&.Mui-focused": { color: "white" } },
                    borderColor: "#353752", 
                    backgroundColor: "#353752",
                    borderRadius: "5px",
                    display: "flex"
                }}/>

                <TextField 
                label="Confirmar contraseña" 
                variant="outlined" 
                value={confirmPassword} 
                required
                onChange={(e) => setConfirmPassword(e.target.value)} 
                type="password"
                sx={{
                    input: { color: "white", fontSize: "1.2rem" },
                    label: { color: "white", fontSize: "1rem", "&.Mui-focused": { color: "white" } },
                    borderColor: "#353752", 
                    backgroundColor: "#353752",
                    borderRadius: "5px",
                    display: "flex"
                }}/>

                <TextField 
                label="Url foto de Perfil" 
                variant="outlined" 
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                sx={{
                    input: { color: "white", fontSize: "1.2rem" },
                    label: { color: "white", fontSize: "1rem", "&.Mui-focused": { color: "white" } },
                    borderColor: "#353752", 
                    backgroundColor: "#353752",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent:"center"
                }}/>

                {error && <span style={{color:"red"}}>{error}</span>}

                <Button type="submit" variant="contained" style={{backgroundColor: "#01C818", fontWeight:"bolder", fontSize: "1.2rem"}}>Registrarse</Button>
            </form>
        </Box>
        </div>
    )
};

export default Register;