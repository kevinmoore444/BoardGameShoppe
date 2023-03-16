import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'
import { Card, CardGroup, Button, Col, Row } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchResult = () => {
    const [games, setGames] = useState([])
    const [errors, setErrors] = useState([]);
    const [user, setUser] = useState("")
    const { searchValue } = useParams()
    const [category, setCategory] = useState("KUBCKBkGxV")
    const [searchValues, setSearchValues] = useState("")
    const [isValid, setValid] = useState(false)


    // Initializing navigate to be used in the submit handler.
    const navigate = useNavigate()

    //Validating the search bar input field
    const validate = () => {
        return searchValue.length;
    };

    //useEffect to set the valid search input
    useEffect(() => {
        const isValid = validate();
        setValid(isValid);
    }, [searchValue]);

    //useEffect to display all games containing the search parameter/value
    useEffect(() => {
        axios.get(`https://api.boardgameatlas.com/api/search?name=${searchValue}&client_id=JLBr5npPhV`)
            .then((response) => {
                console.log("This is the .then function ", response.data)
                setGames(response.data.games)
            })
            .catch((error) => { console.log("This is the error message ", error) })

        console.log("Running before data is received")
    }, [searchValue])

    //Retrieving the logged in user for conditional rendering
    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((err) => console.log('This is our get one function: ' + err))
    }, [])

    //Adding to cart after confirming the logged in user
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

    //Redirecting to categories page if the user decides to filter by category
    const sendInquiry = ((e) => {
        console.log("This is the send inquiry function")
        setCategory(e.target.value)
        navigate(`/categories/${category}`)
    })

    //Logging out the user
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
            <h1 className='browse'>Here Are Your Search Results</h1>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                    {/* Drop down menu for selecting the category */}
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
                {/* Search bar input field */}
                <Form style={{ width: "250px", display: "flex", height: "38px" }}>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchValues} onChange={(e) => setSearchValues(e.target.value)}
                    />
                    <Button variant="outline-primary" disabled={!isValid}><Link to={`/search/${searchValues}`}>Search</Link></Button>
                </Form>
            </div>

            {/* Rendering Search Results */}
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


export default SearchResult