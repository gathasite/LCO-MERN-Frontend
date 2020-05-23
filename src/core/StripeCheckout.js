import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { emptyCart, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    // return products.reduce((curreValue, nextValue) => {
    //   return curreValue + nextValue.count * nextValue;
    // }, 0);
    let amount = 0;
    if (products) {
      products.map((p) => {
        amount = amount + p.price;
      });
    }
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayments`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        // call further method here
        const { status } = response;
        console.log("STATUS ", status);
        emptyCart();
      })
      .catch((err) => console.log(err));
  };

  const stripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_9EEBKDFgfLyI2GjQrgcpeoaO00BHng0hM6"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy TShirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe checkout {getFinalAmount()}</h3>
      {stripeButton()}
    </div>
  );
};

export default StripeCheckout;
