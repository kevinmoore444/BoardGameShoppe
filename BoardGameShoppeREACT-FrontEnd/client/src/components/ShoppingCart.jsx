import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import '../App.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import StripeButton from './stripebutton.component';


const ShoppingCart = () => {
    const [games, setGames] = useState([])
    const [errors, setErrors] = useState([]);
    const [deleteToggle, setDeleteToggle] = useState(false)
    const [user, setUser] = useState("")

    // Initializing navigate to be used in the submit handler.
    const navigate = useNavigate()

    //Declaring variables to calculate shopping cart totals later in the code
    var totalCartPrice = 0;
    var shipping = 5.99
    var cartPriceShipping = 0;
    var tax = 0.08
    var taxCollected = 0;
    var total = 0

    //Retrieving the cart from the database
    useEffect(() => {
        axios.get("http://localhost:8080/api/getCart", { withCredentials: true })
            .then((response) => {
                console.log("This is the .then function ", response.data)
                console.log(response.data)
                setGames(response.data)
            })
            .catch((error) => { console.log("This is the error message ", error) })

        console.log("Running before data is received")
    }, [deleteToggle])

    //Retrieving the logged in user for conditional rendering
    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((err) => console.log('This is our get one function: ' + err))
    }, [])

    //Enabling the user to remove items from the cart
    const removeFromCartSubmitHandler = (e, game) => {
        e.preventDefault()
        const boardGame = {
            apiId: game.id,
            game_id: game.name,
            price: game.msrp,
            imageUrl: game.image_url
        }
        axios.get(`http://localhost:8080/api/removeCart/${game.id}`,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            .then((res) => {
                console.log("Removed from cart")
                setDeleteToggle(!deleteToggle)

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


    return (
        <div className='App container d-flex'>
            <div style={{ width: '70%' }}>
                <h1 className='cart'>{user.firstName ? `${user.firstName}'s Shopping cart` : `Shopping Cart`}</h1>
                {games.map((game) => {

                    // Calculations for shopping cart totals
                    totalCartPrice += parseFloat(game.price)
                    cartPriceShipping = totalCartPrice + shipping
                    taxCollected = (cartPriceShipping * tax)
                    total = cartPriceShipping + taxCollected

                    return (
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex flex-row align-items-center">
                                        <div>
                                            <img
                                                src={game.imageUrl}
                                                className="img-fluid rounded-3" alt="Shopping item" style={{ width: '65px' }} />
                                        </div>
                                        <div className="ms-3">
                                            <h5><Link to={`/details/${game.apiId}`} className="link-dark">{game.boardGame}</Link></h5>

                                        </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center">
                                        <div style={{ marginRight: '60px' }}>
                                            <h5 className="fw-normal mb-0">${game.price}</h5>

                                        </div>

                                        {/* Confirmation before removing from cart */}
                                        <div>
                                            <button onClick={(e) => window.confirm("Are you sure you want to remove this from the cart?") && removeFromCartSubmitHandler(e, game)} className='btn btn-outline-danger mt-auto'>Remove</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    )
                })}
            </div>
            <div id='pricing' className='sticky-top' style={{ marginLeft: '20px', width: '30%' }} >
                <h1>Order Summary</h1>
                <div className="card text-center" style={{ height: '300px' }}>
                {/* Adding the Stripe Button Component to enable payment processing */}
                    <div class="card-body">
                        <p class="card-title">Items Total: ${totalCartPrice.toFixed(2)}</p>
                        <p class="card-title">Shipping: ${shipping}</p> <hr />
                        <p class="card-title">Total Before Tax: ${cartPriceShipping.toFixed(2)}</p>
                        <p class="card-title">Estimated Tax To Be Collected: ${taxCollected.toFixed(2)}</p> <hr />
                        <h4 style={{ color: "coral" }}>Order Total: ${total.toFixed(2)}</h4>
                        <StripeButton price={total.toFixed(2)} />
                    </div>
                </div>
            </div>
        </div>

    )
}


export default ShoppingCart
