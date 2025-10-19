import { Button } from "@mui/material";
import type { User } from "../types/users";
import Avatar from '@mui/material/Avatar';

interface ProfileProps {
    user: User | null;
}

const Profile = ({ user }: ProfileProps) => {
    if (!user) {
        return <p style={{ textAlign: "center" }}>Debes iniciar sesión para ver tu perfil.</p>;;
    }

    const favourites = user.favourites.slice(0,3);
    const wishlist = user.wishlist.slice(0,3);

    return (
        <div style={{display:"flex", width:"100%", maxWidth:"100vw", padding:"2rem", boxSizing:"border-box", overflow:"hidden", justifyContent:"space-evenly", alignItems:"stretch", gap:"3rem", flexDirection:"column"}}>
            <div style={{display:"flex", gap:"30px", marginTop:"70px", alignItems:"center", flexWrap:"wrap"}}>
                <Avatar
                alt="Remy Sharp"
                src="/broken-image.jpg"
                sx={{ width: "150px", height:"150px" }}
                />
                <h2>{user.username}</h2>
            </div>
            <div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{margin:"0px"}}>Favoritos</h2>
                    <Button variant="text" sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr/>
                <div>
                { favourites.length !== 0 ?
                    (favourites.map((game, index) => (
                        <div className="card" key={index}>
                            <p><img src={game.image} style={{maxWidth: "264px", maxHeight: "352px"}}/></p>
                            <h3>{game.name}</h3>
                            <p>Autor: {game.creator}</p>
                            <p>Califición: {game.rating}</p>
                        </div>
                    ))) : <p style={{marginBottom:"70px"}}>No hay juegos para mostrar</p>
                }
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{margin:"0px"}}>Wishlist</h2>
                    <Button variant="text" sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr/>
                <div>
                { wishlist.length !== 0 ?
                    (wishlist.map((game, index) => (
                        <div className="card" key={index}>
                            <p><img src={game.image} style={{maxWidth: "264px", maxHeight: "352px"}}/></p>
                            <h3>{game.name}</h3>
                            <p>Autor: {game.creator}</p>
                            <p>Califición: {game.rating}</p>
                        </div>
                    ))) : <p style={{marginBottom:"70px"}}>No hay juegos para mostrar</p>
                }
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{margin:"0px"}}>Reviews</h2>
                    <Button variant="text" sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr/>
            </div>
        </div>
    )
}

export default Profile;