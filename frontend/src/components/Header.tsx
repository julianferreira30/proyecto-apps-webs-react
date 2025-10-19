import { useState } from "react";
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TextField from "@mui/material/TextField";
import type { User } from "../types/users";
import loginService from "../services/login";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

interface HeaderProps {
  title: string;
  user: User | null;
  onLogout?: () => void;
  onLogin?: (user: User) => void;
  showLoginForm?: boolean;
  setShowLoginForm?: (show: boolean) => void;
}

export const Header = ({ title, user, onLogout, onLogin, showLoginForm, setShowLoginForm }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    onLogout?.();
    setOpen(false);
  }

  const handleLoginClick = () => {
    setShowLoginForm?.(true);
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const userData = await loginService.login({username, password});
      onLogin?.(userData);
      handleCloseLogin();
      navigate("/perfil")
    } catch (e) {
      console.error("Error al iniciar sesión", e);
      setError("Usuario o contraseña incorrectos");
      setTimeout(() => {
        setError(null)
      }, 5000);
    }
  }

  const handleCloseLogin = () => {
    setShowLoginForm?.(false);
    setUsername("");
    setPassword("");
    setError(null);
  };

  const handleRegisterClick = () => {
    setOpen(false);
    navigate("/register");
  }

  const handleGamesClick = () => {
    navigate("/");
  }

  const handleProfileClick = () => {
    setOpen(false);
    navigate("/perfil")
  }

  const handleAddGameClick = () => {
    setOpen(false);
    navigate("/add-game");
  }

  return (
    <header
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.1rem",
        height: "70px",
        zIndex: 2000,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "500", paddingLeft: "2rem" }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", paddingRight: "7rem" }}>
          <Fade in={showLoginForm} timeout={1000}>
          <form onSubmit={handleSubmit} style={{
            display: showLoginForm ? "flex" : "none",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 1rem"
          }}
          >
            <IconButton onClick={handleCloseLogin} size="small" sx={{color:"white"}}><CloseIcon/></IconButton>
            <TextField 
              label="Nombre de usuario"
              variant="outlined"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                fieldset: { borderColor: "white" },
              }}/>

            <TextField 
              label="Contraseña"
              variant="outlined"
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                fieldset: { borderColor: "white" },
              }}/>

            <Button type="submit" variant="contained" style={{backgroundColor: "black", fontSize: "0.7rem"}}>Iniciar sesión</Button>
            {error && (
              <span style={{color:"red", fontSize: "0.8rem"}}>{error}</span>
            )}
          </form>
          </Fade>
        <Fade in={!showLoginForm} timeout={1000}>
        <div style={{
            display: !showLoginForm ? "flex" : "none",
            alignItems: "center",
            gap: "1rem"
          }}>
          <Button variant="text" sx={{ fontFamily: "Roboto, sans-serif", fontSize: "1rem", textTransform: "none", color: "white"}} onClick={handleGamesClick}>Juegos</Button>
          <div>
            <List>
              <ListItemButton
                onClick={handleClick}
              >
                <ListItemText primary="Cuenta"/>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </List>
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit
              sx={{
                position: "absolute",
                backgroundColor: "rgba(114, 114, 114, 1)",
              }}
            >
              <List component="div" disablePadding>
                {!user ? (
                    <div>
                      <ListItemButton sx={{ pl: 2 }} onClick={handleLoginClick}>
                        <ListItemText primary=" Iniciar sesión"/>
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 2 }} onClick={handleRegisterClick}>
                        <ListItemText primary="Registrarse"/>
                      </ListItemButton>
                    </div>
                    ) : (
                      <div>
                        <ListItemButton sx={{ pl: 2 }} onClick={handleProfileClick}>
                          <ListItemText primary="Perfil"/>
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 2 }} onClick={handleLogout}>
                          <ListItemText primary="Cerrar sesión"/>
                        </ListItemButton>
                      </div>
                      )}
              </List>
            </Collapse>
          </div>
          {user && <Button variant="contained" style={{ backgroundColor: "black", fontSize: "0.7rem" }} onClick={handleAddGameClick}>Añadir juego</Button>}
        </div>
        </Fade>
      </div>
    </header>
  );
};
