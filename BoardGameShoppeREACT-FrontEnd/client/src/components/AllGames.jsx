import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Button, Col, Row, Form } from "react-bootstrap";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const AllGames = () => {
    const [games, setGames] = useState([])
    const [category, setCategory] = useState("KUBCKBkGxV")
    const [errors, setErrors] = useState([]);
    const [user, setUser] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [isValid, setValid] = useState(false)

    // Initializing navigate to be used in the submit handler.
    const navigate = useNavigate()

    const validate = () => {
        return searchValue.length;
    };
    useEffect(() => {
        const isValid = validate();
        setValid(isValid);
    }, [searchValue]);

    //Render the top 51 games using external API request to Board Game Atlas
    useEffect(() => {
        axios.get("https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&limit=51&client_id=JLBr5npPhV")
            .then((response) => {
                console.log("This is the .then function ", response.data)
                setGames(response.data.games)
            })
            .catch((error) => { console.log("This is the error message ", error) })

        console.log("Running before data is received")
    }, [])

    //Retrieving logged in user for the purposes of conditional rendering
    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((err) => console.log('This is our get one function: ' + err))
    }, [])

    //Adding items to cart but also confirming if user is logged in
    const addToCartSubmitHandler = (e, game) => {
        e.preventDefault()
        if (!user) {
            window.alert("Please login to add to shopping cart")
            // navigate("/login");
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

    //Redirecting to categories page with the correspoding category ID
    const sendInquiry = ((e) => {
        console.log("This is the send inquiry function")
        navigate(`/categories/${category}`)
    })


    //Logging out the user and redirecting to login page
    const logoutUser = (e) => {
        e.preventDefault()
        console.log("user loggedout")

        axios.get('http://localhost:8080/api/logout', {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        })
        navigate("/login")
    }
    return (
        <div className="container">
            <h1 className='browse'>{user.firstName ? `Browse Our Selection, ${user.firstName}` : `Browse Our Selection`}</h1>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                    {/* Drop down for filtering by category */}
                    <Form.Group>
                        <Form.Select id="select" onChange={(e) => { setCategory(e.target.value) }}>
                            <option value="KUBCKBkGxV">Adventure</option>
                            <option value="HKaYVNIxAJ">Children's</option>
                            <option value="B3NRLMK4xD">Educational</option>
                            <option value="pflvcNyHPe">Escape Room</option>
                            <option value="ZTneo8TaIO">Fantasy</option>
                            <option value="KzEQIwIub7">History</option>
                            <option value="TYnxiuiI3X">Humor</option>
                            <option value="POlqwScVxD">Math</option>
                            <option value="L6NUwNdblq">Modern Warfare</option>
                            <option value="WVMOS3s2pb">Puzzle</option>
                            <option value="2Gu62aKdma">RPG</option>
                            <option value="3B3QpKvXD3">Sci-Fi</option>
                            <option value="VzyslQJGrG">Solo</option>
                            <option value="a2eMKxxlVW">Two Player Only</option>
                        </Form.Select>
                    </Form.Group>
                    <Button onClick={sendInquiry} style={{ marginLeft: "10px" }} variant="outline-primary" >Search by Category</Button>
                </div>
                {/* Search feature for finding games based on search parameters */}
                <Form style={{ width: "250px", display: "flex", height: "38px" }}>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Button variant="outline-primary" disabled={!isValid}><Link to={`/search/${searchValue}`}>Search</Link></Button>
                </Form>
            </div>
            
            {/* Rendering the results of the first API call to display top 51 games */}
            {games.length === 0 && <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
            <Row>
                {games.map((game, idx) => {
                    return (
                        <Col sm={6} md={4} className='mt-5'>
                            <div className="card d-inline-flex border-0 h-100" style={{ width: '18rem', boxShadow: '0px 0px 4px 4px #ccc' }} key={idx}>
                                <img class="card-img-top" src={game.image_url} alt="board game" height={"210px"} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="h5"><Link to={`/details/${game.id}`} className="link-dark">{game.name}</Link></h5>
                                    <p className="card-text">{game.msrp_text}</p>
                                    <form onSubmit={(e) => addToCartSubmitHandler(e, game)}>
                                        <button type='submit' className='btn btn-outline-primary mt-auto'>Add to Cart</button>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>

        </div>

    )
}

export default AllGames



