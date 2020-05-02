import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";

const signInForm = () => {
  return (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        <form>
          <div className="form-group">
            <label htmlFor="" className="text-light">
              Email
            </label>
            <input className="form-control" type="email" />
          </div>
          <div className="form-group">
            <label htmlFor="" className="text-light">
              Password
            </label>
            <input className="form-control" type="password" />
          </div>
          <button className="btn btn-success btn-block">Submit</button>
        </form>
      </div>
    </div>
  );
};

const Signin = () => {
  return (
    <Base title="Sign in" decription="A page for user to Signin!">
      {signInForm()}
    </Base>
  );
};

export default Signin;
