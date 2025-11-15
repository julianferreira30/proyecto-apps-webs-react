import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import registerService from "../services/register";
import loginService from "../services/login"
import { useNavigate } from "react-router-dom";
import type { User } from "../types/users";

interface RegisterProps {
    onLogin: (user: User) => void;
};

const Register = ({ onLogin }: RegisterProps) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        try {
            await registerService.register({profile_image: "", username, name, password});
            const userData = await loginService.login({username, password});
            onLogin(userData);
            navigate("/")
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("Error inesperado al registrar el usuario")
            }
        }

    };

    return (
        <Box sx={{alignItems:"center", display:"flex", flexDirection:"column", marginTop:"30px"}}>
            <h1>Crear cuenta</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px", justifyContent:"center" }}>
                <TextField 
                label="Nombre" 
                variant="outlined" 
                value={name} 
                required
                onChange={(e) => setName(e.target.value)}
                sx={{
                input: { color: "white" },
                label: { color: "white" },
                fieldset: { borderColor: "white" },
                }}/>

                <TextField 
                label="Nombre de usuario" 
                variant="outlined" 
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                input: { color: "white" },
                label: { color: "white" },
                fieldset: { borderColor: "white" },
                }}/>

                <TextField 
                label="Contraseña" 
                variant="outlined" 
                value={password} 
                required
                onChange={(e) => setPassword(e.target.value)} 
                type="password"
                sx={{
                input: { color: "white" },
                label: { color: "white" },
                fieldset: { borderColor: "white" },
                }}/>

                <TextField 
                label="Confirmar contraseña" 
                variant="outlined" 
                value={confirmPassword} 
                required
                onChange={(e) => setConfirmPassword(e.target.value)} 
                type="password"
                sx={{
                input: { color: "white" },
                label: { color: "white" },
                fieldset: { borderColor: "white" },
                }}/>

                {error && <span style={{color:"red"}}>{error}</span>}

                <Button type="submit" variant="contained" style={{backgroundColor: "black"}}>Registrarse</Button>
            </form>
        </Box>
    )
};

export default Register;