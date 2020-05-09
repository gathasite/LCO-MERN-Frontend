import { API } from "../../backend";
// API means the server url i.e host

// signup
export const signup = (user) => {
  alert("user" + JSON.stringify(user));
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      alert("response" + JSON.stringify(response));
      return response.json();
    })
    .catch((err) => console.log(err));
};

// signin
export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// sign out
export const signout = (next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("jwt");
    next();
  }
  return fetch(`${API}/signout`, { method: "GET" })
    .then((response) => console.log("Signout sucessfull"))
    .catch((err) => console.log(err));
};

// authenticate user
export const authenticate = (data, next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("jwt", JSON.stringify(data));
    next();
  }
};

// check if user is authenticated by checking
// for token in the localstorage
export const isAuthenticated = () => {
  if (typeof window !== undefined) {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
