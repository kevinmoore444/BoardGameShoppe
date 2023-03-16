import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const GameDetail = () => {

    const { id } = useParams()
    const [games, setGames] = useState([])
    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [errors, setErrors] = useState([]);

    //Get request for a specific game's details based on external API request with variable parameter
    useEffect(() => {
        axios.get(`https://api.boardgameatlas.com/api/search?ids=${id}&client_id=JLBr5npPhV`)
            .then((response) => {
                console.log("This is the .then function ", response.data)
                setGames(response.data.games)
            })
            .catch((error) => { console.log("This is the error message ", error) })

        console.log("Running before data is received")

    }, [id])

    //Retrieving logged in user
    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((err) => console.log('This is our get one function: ' + err))
    }, [])

    //Checking if user is logged in, and then allowing user to add items to cart
    const addToCartSubmitHandler = (e, game) => {
        e.preventDefault()
        if (!user) {
            navigate("/login");
            return;
        }
        const boardGame = {
            apiId: game.id,
            boardGame: game.name,
            price: game.msrp,
            imageUrl: game.image_url
        }
        axios.post('http://localhost:8080/api/addToCart', JSON.stringify(boardGame),
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            .then((res) => {
                console.log("User Created")
                navigate("/shop")
            })
            .catch((error) => {
                console.log("This is our create page catch error:", error)
                const errorResponse = error.response.data;
                var errorArr = [];
                for (e of errorResponse) {
                    errorArr.push(e.defaultMessage);
                }
                setErrors(errorArr);
            })
    };

    //Game details displaying name, price, description and attributes
    return (
        <div className='container ' id='detailpage'>
            {games.map((game) => {
                return (
                    <div className="d-flex flex-column">
                        <div className="row ">
                            <h1>{game.name}</h1>
                            <div className='image'>
                                <img src={game.image_url} alt="board game" height="400px" style={{ class: "shadow-inner" }} />

                            </div>
                            <div className="payment">
                                <h3>{game.msrp_text}</h3>
                                <form onSubmit={(e) => addToCartSubmitHandler(e, game)}>
                                    <button type='submit' className='btn btn-outline-primary mt-auto'>Add to Cart</button>
                                </form>
                            </div>
                            <div className="description">
                                <br></br>
                                <h4>What is {game.name}?</h4>
                                <p>{game.description_preview}</p>
                            </div>

                            <div className="qualities">
                                <br></br>
                                <h4>Who is it for?</h4>
                                <p>Ages: {game.min_age}+</p>
                                <p>Players: {game.players}</p>
                                <p>Game Length: {game.playtime} minutes</p>
                            </div>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default GameDetail

