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
        <div>
            <div>
                <Avatar
                alt="Remy Sharp"
                src={user.image}
                sx={{ width: 100, height: 100 }}
                />
                <h2>{user.username}</h2>
            </div>
            <div>
                <hr>
                    <div>
                        <h2>Favoritos</h2>
                        <p>Mostrar más</p>
                    </div>
                </hr>
                <div>
                {
                    favourites.map((game, index) => (
                        <div className="card" key={index}>
                            <p><img src={game.image} style={{maxWidth: "264px", maxHeight: "352px"}}/></p>
                            <h3>{game.name}</h3>
                            <p>Autor: {game.creator}</p>
                            <p>Califición: {game.rating}</p>
                        </div>
                    ))
                }
                </div>
                <hr>
                    <div>
                        <h2>Wishlist</h2>
                        <p>Mostrar más</p>
                    </div>
                </hr>
                <div>
                {
                    wishlist.map((game, index) => (
                        <div className="card" key={index}>
                            <p><img src={game.image} style={{maxWidth: "264px", maxHeight: "352px"}}/></p>
                            <h3>{game.name}</h3>
                            <p>Autor: {game.creator}</p>
                            <p>Califición: {game.rating}</p>
                        </div>
                    ))
                }
                </div>
                <hr>
                    <div>
                        <h2>Reviews</h2>
                        <p>Mostrar más</p>
                    </div>
                </hr>
            </div>
        </div>
    )
}

export default Profile;