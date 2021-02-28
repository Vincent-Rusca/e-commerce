import React, { Component } from "react";
import withContext from "../withContext";
import { Redirect, withRouter } from "react-router-dom";
import axios from 'axios';

const initState = {
  id: "default",
  name: "default",
  price: "69",
  stock: "69",
  shortDesc: "default",
  description: "default"
};

class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.location.product;
  }

  save = async (e) => {
    e.preventDefault();
    const { id, name, price, stock, shortDesc, description } = this.state;

    await axios.put(
      `http://localhost:3001/products/${id}`, {...this.state}
    )

    const originalProduct = this.props.location.product;
    // editProduct = (originalProduct, editedProduct, callback)
    this.props.context.editProduct(
      originalProduct,
      {
        id,
        name,
        price,
        shortDesc,
        description,
        stock: stock || 0
      }
    );

    // go back to ManageProduct
    this.props.history.push('/manage-products');

  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value, error: "" });

  render() {
    const { id, name, price, stock, shortDesc, description } = this.state;
    const { user } = this.props.context;

    //console.log(this.props.location.productIndex);

    return !(user && user.accessLevel < 1) ? (
      <Redirect to="/" />
    ) : (
      <div>
        <div className="hero is-primary ">
          <div className="hero-body container">
            <h4 className="title">Edit Product</h4>
            <hr />
          </div>
        </div>
        <br />
        <br />
        <form onSubmit={this.save}>
          <div className="columns is-mobile is-centered">
            <div className="column is-one-third">
              <small><b>Item ID:</b> {id}</small>
              <hr />
              <div className="field">
                <label className="label">Product Name: </label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="field">
                <label className="label">Price: </label>
                <input
                  className="input"
                  type="number"
                  name="price"
                  value={price}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="field">
                <label className="label">Available in Stock: </label>
                <input
                  className="input"
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Short Description: </label>
                <input
                  className="input"
                  type="text"
                  name="shortDesc"
                  value={shortDesc}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Description: </label>
                <textarea
                  className="textarea"
                  type="text"
                  rows="2"
                  style={{ resize: "none" }}
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </div>
              {this.state.flash && (
                <div className={`notification ${this.state.flash.status}`}>
                  {this.state.flash.msg}
                </div>
              )}
              <div className="field is-clearfix">
                <button
                  className="button is-primary is-outlined is-pulled-right"
                  type="submit"
                  onClick={this.save}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withContext(EditProduct);

// export default function AddProduct() {
// 	return <>AddProduct</>
// }