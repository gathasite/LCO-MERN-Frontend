import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { emptyCart, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";

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
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    //
  };

  const stripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey=""
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
