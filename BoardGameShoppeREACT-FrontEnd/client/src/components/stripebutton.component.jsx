import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import BoardGame from './../static/board-game.png';

const StripeButton = ({ price }) => {
  //Please use your own publishableKey as found on Stripe API dashboard after creating an account
  const publishableKey = "pk_test_51MjUysJPP2goUjJc4K0YXIdJBf4zXVJL2hN2leIhFeh6t9L4kLEZm337jMUU2WGpBBLlUt4bXt9HNXf26GERwrqy00EoHkNvyJ";
  const stripePrice = price * 100;

  //Hook to make an axios post request to backend Payment Controller and generate a payment using a token
  const onToken = (token) => {
    console.log(token);
    axios
      .post("http://localhost:8080/api/payment", {
        amount: stripePrice,
        token,
      })
      .then((response) => {
        console.log(response);
        alert("payment success");
      })
      .catch((error) => {
        console.log(error);
        alert("Payment failed");
      });
  };

  // Another Stripe component to create a pop-up that appears once checkout button is clicked on the Shopping Cart page and make an immediate payment
  return (
    <StripeCheckout
      amount={stripePrice}
      label="Checkout"
      name="Board Game Shoppe"
      image={BoardGame}
      description={`Your total is $${price}`}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
      currency="USD"
    />
  );
};

export default StripeButton;