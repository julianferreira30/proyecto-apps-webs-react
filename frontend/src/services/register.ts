import axios from "axios";

type RegisterData = {
    username: string;
    name: string;
    password: string;
};

const register = async (data: RegisterData) => {
    return await axios
    .post("/api/register", data)
    .then((request) => request.data)
    .catch((error) => {
        if (error.response.status === 409) {
            throw new Error("El nombre de usuario ya existe");
        } else if (error.response.data === 400) {
            throw new Error("Debe completar todos los campos");
        } else {
            throw new Error("Error inesperado al registrar el usuario");
        }
    })
};

export default { register };