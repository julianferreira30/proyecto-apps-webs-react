import { Button } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { setShowLoginForm } from "../reducers/userReducer";
import Rating from '@mui/material/Rating';


const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const loading = useSelector((state: RootState) => state.user.loading);
    const games = useSelector((state: RootState) => state.games.games);
    const navigate = useNavigate();
    if (!user && !loading) {
        dispatch(setShowLoginForm(true));
        return <p style={{ textAlign: "center", marginTop:"90px" }}>Debes iniciar sesión para ver tu perfil.</p>;;
    }

    if (loading) {
        dispatch(setShowLoginForm(false));
        return;
    }

    const favourites = user?.favorites.slice(0,3);
    const wishlist = user?.wishlist.slice(0,3);
    const played = user?.played.slice(0,3);
    const reviews = user?.reviews.slice(0,3);

    const getGame = (id: string) =>  games.find((g) => g.id === id);


    return (
        <div style={{display:"flex", justifyContent:"center"}}>
        <div style={{display:"flex", width:"70%", maxWidth:"100vw",  boxSizing:"border-box", overflow:"hidden", justifyContent:"space-evenly", alignItems:"stretch", gap:"3rem", flexDirection:"column"}}>
            <div style={{display:"flex", gap:"30px", marginTop:"70px", alignItems:"center", flexWrap:"wrap"}}>
                <Avatar
                alt="Remy Sharp"
                src={user?.profile_image}
                sx={{ width: "100px", height:"100px" }}
                />
                <h2>{user?.username}</h2>
            </div>
            <div>


                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{margin:"0px"}}>Jugados</h2>
                    <Button variant="text" onClick={() => navigate("/perfil/jugados")} sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr  style={{marginTop:"0px"}}/>
                <div style={{ marginTop:"20px", display: "flex", gap: "20px",justifyContent:played?.length!== 0 ? "flex-start": "center",alignItems: "flex-start", flexWrap:"wrap"}}>
                { played?.length !== 0 ?
                    (played?.map((game, index) => (
                        <div className="card" key={index} onClick={() => navigate(`/game/${game.id}`)}>
                            <p style={{margin:"5px"}}><img src={game.image} style={{maxWidth: "264px", maxHeight: "300px"}}/></p>
                            <h2 style={{margin:"5px"}}>{game.name}</h2>
                        </div>
                    ))) : <p style={{marginBottom:"70px"}}>No hay juegos para mostrar</p>
                }
                </div>


                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{marginTop:"70px", marginBottom:"0px"}}>Favoritos</h2>
                    <Button variant="text" onClick={() => navigate("/perfil/favoritos")} sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr style={{marginTop:"0px"}}/>
                <div style={{ marginTop:"20px", display: "flex", gap: "20px",justifyContent:favourites?.length!== 0 ? "flex-start": "center",alignItems: "flex-start", flexWrap:"wrap"}}>
                { favourites?.length !== 0 ?
                    (favourites?.map((game, index) => (
                        <div className="card" key={index} onClick={() => navigate(`/game/${game.id}`)}>
                            <p style={{margin:"5px"}}><img src={game.image} style={{maxWidth: "264px", maxHeight: "300px"}}/></p>
                            <h2 style={{margin:"0px"}}>{game.name}</h2>
                        </div>
                    ))) : <p style={{marginBottom:"70px"}}>No hay juegos para mostrar</p>
                }
                </div>


                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{marginTop:"70px", marginBottom:"0px"}}>Wishlist</h2>
                    <Button variant="text"  onClick={() => navigate("/perfil/wishlist")} sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr  style={{marginTop:"0px"}}/>
                <div style={{ marginTop:"20px", display: "flex", gap: "20px",justifyContent:wishlist?.length!== 0 ? "flex-start": "center",alignItems: "flex-start", flexWrap:"wrap"}}>
                { wishlist?.length !== 0 ?
                    (wishlist?.map((game, index) => (
                        <div className="card" key={index} onClick={() => navigate(`/game/${game.id}`)}>
                            <p style={{margin:"5px"}}><img src={game.image} style={{maxWidth: "264px", maxHeight: "300px"}}/></p>
                            <h2 style={{margin:"5px"}}>{game.name}</h2>
                        </div>
                    ))) : <p style={{marginBottom:"70px"}}>No hay juegos para mostrar</p>
                }
                </div>


                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <h2 style={{marginTop:"70px", marginBottom:"0px"}}>Mis reviews</h2>
                    <Button variant="text" onClick={() => navigate("/perfil/reviews")} sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none", color: "white", margin:"0px"}}>Mostrar más</Button>
                </div>
                <hr  style={{marginTop:"0px"}}/>
                <div style={{ marginTop:"20px", display: "flex", gap: "20px",justifyContent:"center",alignItems: "flex-start", flexWrap:"wrap"}}>
                { reviews?.length !== 0 ?
                    (reviews?.map((review) => (
                        <div style={{backgroundColor:"#252637", 
                        border: "1px solid white", 
                        borderRadius:"5px", 
                        padding:"20px",
                        display:"flex",
                        width:"90%"}}>
                            <div>
                                <img
                                    src={getGame(review.game)?.image}
                                    alt={getGame(review.game)?.name}
                                    style={{maxWidth: "264px", maxHeight: "300px", marginRight:"10px" }}
                                />
                            </div>
                            <div style={{display:"flex",
                                flexDirection:"column",
                                alignItems:"flex-start",
                                marginLeft:"20px",
                                width:"100%",
                            }}>
                                <h2 style={{margin:"0px 0px 10px 0px", padding:"0px"}}>{getGame(review.game)?.name}</h2>
                                <div style={{display:"flex",
                                    alignItems:"center",
                                    gap:"10px"
                                }}>
                                    <p style={{width:"100%"}}>Calificación</p><Rating name="half-rating-read" value={review.rating} precision={0.5} readOnly/>
                                </div>
                                <div style={{
                                    backgroundColor: "#14152a",
                                    padding: "20px",
                                    borderRadius: "5px",
                                    whiteSpace: "pre-wrap",     
                                    overflowWrap: "break-word", 
                                    wordBreak: "break-word",     
                                    width: "90%", 
                                    textAlign:"left"             
                                }}>
                                    {review.content}
                                </div>
                            </div>
                        </div>
                    ))) : <p style={{marginBottom:"70px"}}>No hay reviews para mostrar</p>
                }
                </div>
            </div>
        </div>
        </div>
    )
}

export default Profile;