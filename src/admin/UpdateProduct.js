import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Base from "../core/Base";
import {
  getAllCategories,
  updateProduct,
  getProduct,
} from "../admin/helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateProduct = ({ match }) => {
  // react hooks
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getRedirect,
    formData,
  } = values;

  const { user, token } = isAuthenticated();

  const preload = (productId) => {
    getProduct(productId).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        preloadCategories();
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          stock: data.stock,
          formData: new FormData(),
        });
      }
    });
  };

  const preloadCategories = () => {
    getAllCategories().then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          categories: data,
          formData: new FormData(),
        });
      }
    });
  };

  // react hooks
  useEffect(() => {
    preload(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      error: "",
      loading: true,
    });
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            stock: "",
            photo: "",
            loading: false,
            getRedirect: true,
            createdProduct: data.product.name,
          });
        }
      }
    );
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4 className="text-success">{createdProduct} updated successfully</h4>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger mt-3"
        style={{ display: error ? "" : "none" }}
      >
        <h4 className="text-danger">Failed to update product</h4>
      </div>
    );
  };

  const performRedirect = () => {
    if (getRedirect) {
      setTimeout(() => {
        return <Redirect to="/admin/dashboard" />;
      }, 10000);
    }
  };

  const loadingMessage = () => {
    return (
      <div
        className="alert alert-info mt-3"
        style={{ display: loading ? "" : "none" }}
      >
        <h4 className="text-info">Updating category...</h4>
      </div>
    );
  };

  const updateProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="name"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="description"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          name="price"
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          name="category"
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cat, index) => (
              <option key={index} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          name="stock"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Product
      </button>
    </form>
  );

  return (
    <Base
      title="Update product here!"
      description="Welcome to update product section"
      className="container bg-info p-4"
    >
      {loadingMessage()}
      {successMessage()}
      {errorMessage()}
      {performRedirect()}
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">{updateProductForm()}</div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
