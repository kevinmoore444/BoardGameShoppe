import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
    // Variables and State Variables for the login form.
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Variables to hold the catch error defined in the submit handler. This is for validation purposes.
    const [regErrors, setRegErrors] = useState([]);
    const [loginErrors, setLoginErrors] = useState([]);

    // Initializing navigate to be used in the submit handler.
    const navigate = useNavigate()

    // Prevent default prevents the page from reloading and erasing the state variables.
    // Putting the fields from the form into a user object and passing that, along with
    // login credentials - a Json webtoken for authentication purposes- as part of a Post request.
    // The catch error is meant to respond with errors when submitted fields conflict with the parameters of the user_model.
    const submitHandler = (e) => {
        e.preventDefault()
        const user = {firstName, lastName,  email, password, confirmPassword}
        console.log("Here is my login info: ", user)
        axios.post('http://localhost:8080/api/register', JSON.stringify(user), 
        {
            headers:  {"Content-Type": "application/json"},
            withCredentials : true
        })
        .then ((res) => {
            console.log("User Created")
            navigate("/store")
            window.location.reload();
        })
        .catch ((error) => {
            console.log("This is our create page catch error:", error)
            const errorResponse = error.response.data; 
            var errorArr = [];
            for (e of errorResponse) {
                errorArr.push(e.defaultMessage);
            }
            setRegErrors(errorArr);
        })
}

    // Login submits the loginemail and password as a post request. This is received by the route
    // "/api/login" and invokes the function in the controller where all the magic happens.

const loginUser = (e) => {
        e.preventDefault()
        console.log("Here is my login info: ", loginEmail + loginPassword)
        axios.post("http://localhost:8080/api/login", {loginEmail, loginPassword}, { headers: {"Content-Type": "application/json"}, withCredentials : true})
        .then((response) => {
            navigate('/store');
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
            const errorResponse = error.response.data; 
            var errorArr = [];
            for (e of errorResponse) {
                errorArr.push(e.defaultMessage);
            }
            setLoginErrors(errorArr);
        })         
}

    // This is my reg form. On change of the fields in the, the setFirstName will literally set "firstName" and so forth through the form
    // Upon submission, submit handler will be invoked, which will submit these values into the database as a POST request.

  return (
    <div className='container'>
    <div className='row'>
        <div className='col'>
        <form onSubmit={submitHandler} >
            <h2 className='reg'>Register</h2>
            <br/>
            <input className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder='First Name*'/>
            {
                    firstName.length < 3 && firstName.length > 0 ? <p className='text-danger'>Name must be 3+ characters!!</p> : ""
            }
            <br/>
            <input className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder='Last Name*'/>
            {
                    lastName.length < 3 && lastName.length > 0 ? <p className='text-danger'>Name must be 3+ characters!!</p> : ""
            }
            <br/>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email Address*'/>
            <br/>
            <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password*'/>
            <br/>
            <input className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder='Confirm Password*'/>
            <br/>
            <p color='red'> * indicates required field</p>
            <button className='btn btn-outline-success' type='submit'>Create User</button>

            {/* This line is part of data validations defined in the model and up above in the code */}
            {regErrors.map((err, index) => <p key={index} style={{color:"red"}}>{err}</p>)}
        </form>
        </div>
        <div className='col'>
            {/* This is the Login Form */}
            <form onSubmit={loginUser} className='login'>
            {/* <br></br> */}
            <h2 className='log'>Log In</h2>
            <br/>
            <input className="form-control" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="text" placeholder='Email Address'/>
            <br/>
            <input className="form-control" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" placeholder='Password'/>
            <br/>
            <button className='btn btn-outline-success' type='submit'>Log In</button>
            <br/>
            {loginErrors.map((err, index) => <p key={index} style={{color:"red"}}>{err}</p>)}
            </form>
        </div>

    </div>
    </div>
  )
}

export default LoginForm