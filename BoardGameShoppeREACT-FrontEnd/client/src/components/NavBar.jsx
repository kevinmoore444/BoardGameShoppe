import React, { useState, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import shoppingcartLogo from './../static/shopping-cart-32.png';


const NavBar = () => {
  const [user, setUser] = useState("")
  const navigate = useNavigate()

  //Retrieving logged in user to conditionally render login/log out button
  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.log('This is our get one function: ' + err))
  }, [])

  //Log out the logged in user
  const logoutUser = (e) => {
    e.preventDefault()
    console.log("user loggedout")

    axios.get('http://localhost:8080/api/logout', {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
    navigate("/login")
    window.location.reload();
  }


  return (
    <div>
      <Navbar bg="dark" expand="lg" className='fixed-top'>
        <Navbar.Brand id="Appname" style={{ color: "whitesmoke" }}>The Board Game Shoppe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav ">
          <Nav className="me-auto">
            <Nav.Link href="/" style={{ color: "whitesmoke" }}>Home</Nav.Link>
            <Nav.Link href="/store" style={{ color: "whitesmoke" }}>Store</Nav.Link>
          </Nav>

          <div id='logandCart'>
            {user.id != null ?
              <Link onClick={logoutUser} className="btn btn-outline-danger">Logout</Link>
              :
              <Link to={"/login"} className="btn btn-outline-primary">Log In</Link>
            }
            <Link to={"/shop"}>

              <img id='shoppingcartimg' src={shoppingcartLogo} />

            </Link>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default NavBar