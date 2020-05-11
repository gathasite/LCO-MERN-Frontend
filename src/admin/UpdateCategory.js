import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Base from "../core/Base";
import {
  getAllCategories,
  updateCategory,
  getCategory,
} from "../admin/helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const UpdateCategory = ({ match }) => {
  // react hooks
  const [values, setValues] = useState({
    name: "",
    loading: false,
    category: "",
    error: "",
    createdCategory: "",
    getRedirect: false,
    formData: "",
    validate: true,
  });

  const {
    name,
    loading,
    category,
    error,
    createdCategory,
    getRedirect,
    formData,
    validate,
  } = values;

  const { user, token } = isAuthenticated();

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // preloadCategories();
        setValues({
          ...values,
          name: data.name,
          category: data._id,
          formData: new FormData(),
        });
      }
    });
  };

  // react hooks
  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    formData.set(name, value);
    if (!value.length) {
      return setValues({
        ...values,
        [name]: value,
        validate: false,
      });
    }
    setValues({ ...values, [name]: value, validate: true });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      error: "",
      loading: true,
    });
    updateCategory(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            loading: false,
            getRedirect: true,
            createdCategory: data.name,
          });
        }
      }
    );
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-3"
        style={{ display: createdCategory ? "" : "none" }}
      >
        <h4 className="text-success">{createdCategory} updated successfully</h4>
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

  const validationError = () => {
    return (
      <div
        className="alert alert-danger mt-3"
        style={{ display: validate ? "none" : "" }}
      >
        <h4 className="text-danger">Category can not be left blank</h4>
      </div>
    );
  };

  const performRedirect = () => {
    if (getRedirect) {
      setTimeout(() => {
        return <Redirect to="/admin/dashboard" />;
      }, 1000);
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

  const updateCategoryForm = () => (
    <form>
      <div className="form-group">
        <label className="btn btn-block btn-success mt-4">
          <input
            onChange={handleChange("name")}
            name="name"
            className="form-control"
            placeholder="Name"
            value={name}
          />
        </label>
      </div>
      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Category
      </button>
    </form>
  );

  return (
    <Base
      title="Update product here!"
      description="Welcome to update product section"
      className="container bg-info p-4"
    >
      {validationError()}
      {loadingMessage()}
      {successMessage()}
      {errorMessage()}
      {performRedirect()}
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">{updateCategoryForm()}</div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
