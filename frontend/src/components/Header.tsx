import { useState } from "react";
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { loginUser, logoutUser, setShowLoginForm, setError } from "../reducers/userReducer";



export const Header = () => {
  // Store
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const showLoginForm = useSelector((state: RootState) => state.user.showLoginForm)
  const error = useSelector((state: RootState) => state.user.error);

  
  // Estados locales y navegación
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  // Manejo de botones del header
  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpen(false);
  }

  const handleLoginClick = () => {
    dispatch(setShowLoginForm(true))
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await dispatch(loginUser({username, password}));
    if (success) {
      dispatch(setShowLoginForm(false));
    }
  }

  const handleCloseLogin = () => {
    dispatch(setShowLoginForm(false));
    setUsername("");
    setPassword("");
    dispatch(setError(null));
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
    navigate("/profile/played")
  }

  const handleAddGameClick = () => {
    setOpen(false);
    navigate("/add-game");
  }

  return (
    <header className="header">
      <div className="header-left">
        <SportsEsportsIcon className="header-icon"></SportsEsportsIcon>

        <div className="title-container">
          <h1>GameBoxd</h1>
        </div>
      </div>

      <div className="header-right">
        <Fade in={showLoginForm} timeout={1000}>
          <div className={`login-wrapper ${showLoginForm ? "show" : "hide"}`}>
            <form onSubmit={handleSubmit} className={`login-form ${showLoginForm ? "show" : "hide"}`}>
              <IconButton onClick={handleCloseLogin} size="small" className="close-icon">
                <CloseIcon />
              </IconButton>

              <TextField 
                className="login-input"
                label="Nombre de usuario"
                variant="filled"
                size="small"
                value={username}
                onClick={() => setError(null)}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField 
                className="login-input"
                label="Contraseña"
                variant="filled"
                size="small"
                type="password"
                value={password}
                autoComplete="current-password"
                onClick={() => setError(null)}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" variant="contained" className="login-button">
                Entrar
              </Button>
            </form>

            {error && (
              <Fade in={!!error} timeout={1000}>
                <span className="login-error">{error}</span>
              </Fade>
            )}
          </div>
        </Fade>

        <Fade in={!showLoginForm} timeout={1000}>
          <div className={`menu-wrapper ${!showLoginForm ? "show" : "hide"}`}>
            <Button variant="text" className="menu-games" onClick={handleGamesClick}>
              Juegos
            </Button>

            <div className="account">
              <List>
                <ListItemButton className="account-button" onClick={handleClick}>
                  <ListItemText 
                    primary="Cuenta" 
                    className="account-label"
                    primaryTypographyProps={{ fontWeight: "bolder" }}
                  />
                  {open ? (
                    <ExpandLess className="account-arrow" />
                  ) : (
                    <ExpandMore className="account-arrow" />
                  )}
                </ListItemButton>
              </List>

              <Collapse in={open} timeout="auto" unmountOnExit className="account-collapse">
                <List component="div" disablePadding className="account-list">
                  {!user ? (
                    <div>
                      <ListItemButton className="account-item" onClick={handleLoginClick}>
                        <ListItemText className="account-item-text" primary=" Iniciar sesión"/>
                      </ListItemButton>
                      <ListItemButton className="account-item" onClick={handleRegisterClick}>
                        <ListItemText className="account-item-text" primary="Registrarse"/>
                      </ListItemButton>
                    </div>
                  ) : (
                    <div>
                      <ListItemButton className="account-item" onClick={handleProfileClick}>
                        <ListItemText className="account-item-text" primary="Perfil"/>
                      </ListItemButton>
                      <ListItemButton className="account-item" onClick={handleLogout}>
                        <ListItemText className="account-item-text" primary="Cerrar sesión"/>
                      </ListItemButton>
                    </div>
                  )}
                </List>
              </Collapse>
            </div>

            {user && (
              <Button variant="contained" className="add-button" onClick={handleAddGameClick}>
                Añadir
              </Button>
            )}
          </div>
        </Fade>
      </div>
    </header>
  );
};