import React, { useState } from "react";
import ManageProductItem from "./ManageProductItem";
import withContext from "../withContext";
import Modal from "./Modal";
import axios from 'axios';
import { Redirect } from "react-router-dom";

const initState = {
  name: "",
  price: "",
  stock: "",
  shortDesc: "",
  description: ""
};

const ManageProducts = props => {
  const { products, user } = props.context;
  const [modalState, setModalState] = useState(false);
  const [focusedProduct, setFocusedProduct] = useState(initState);

  const toggleDeleteModal = () => {
    setModalState(prevModalState => !prevModalState);
  }

  const createDeleteModal = p => {
    setFocusedProduct(p);
    toggleDeleteModal();
  };

  const removeProduct = async (e) => {
    e.preventDefault();

    await axios.delete(`http://localhost:3001/products/${focusedProduct.id}`);
    // deleteProduct = (product, callback)
    props.context.deleteProduct(
      focusedProduct
    );
    toggleDeleteModal();
  }

  return !(user && user.accessLevel < 1) ? 
    (
      <Redirect to="/" />
    ) : 
    (
      <div>
        <div className="hero is-primary">
          <div className="hero-body container">
            <h4 className="title">Manage Products</h4>
            <hr />
          </div>
        </div>
        <br />
        <div className="container">
          <div className="column columns is-multiline">
            {products && products.length ? (
              products.map((product, index) => (
                <ManageProductItem
                  product={product}
                  key={index}
                  addToCart={props.context.addToCart}
                  productAmountInCart={props.context.productAmountInCart}
                  createDeleteModal={createDeleteModal}
                />
              ))
            ) : (
              <div className="column">
                <span className="title has-text-grey-light">
                  No products found!
                </span>
              </div>
            )}
          </div>
        </div>
        <Modal 
          closeModal={toggleDeleteModal} 
          modalState={modalState} 
          title="Delete Item"
          footer={
              <div className="modal-button-div">
                <a className="button modal-button-float-right is-danger"
                  onClick={removeProduct}
                  >Delete
                </a>
                <a className="button modal-button-float-right"
                  onClick={toggleDeleteModal}
                  >Cancel
                </a>
              </div>
          }
        >
          <p>Are you sure you wish to delete <b><span className="product-title">{focusedProduct.name}</span></b>?</p>
          <p className="is-danger is-underlined">This action cannot be undone!</p>
        </Modal>
      </div>
    );
};

export default withContext(ManageProducts);