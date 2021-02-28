import React, {useState} from "react";
import withContext from "../withContext";
import Modal from "./Modal";
import EditProduct from "./EditProduct";
import { Link } from "react-router-dom";

const ManageProductItem = props => {
  const { product } = props;

  // notice that the call to createDeleteModal is within a callback!
  // see https://stackoverflow.com/questions/48497358/reactjs-maximum-update-depth-exceeded-error

  // link to EditProduct info: https://ui.dev/react-router-v4-pass-props-to-link/

  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src="https://bulma.io/images/placeholders/128x128.png"
                alt={product.shortDesc}
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-primary">${product.price}</span>
            </b>
            <div>{product.shortDesc}</div>
            {product.stock > 0 ? (
              <small>{product.stock + " Available"}</small>
            ) : (
              <small className="has-text-danger">Out Of Stock</small>
            )}
            <br />
            {props.productAmountInCart(product) ? (
              <small>{props.productAmountInCart(product) + " in cart"}</small>
              ) : <br />}
            <div className="is-clearfix">
              <div className="is-pulled-right">
                <Link to={{
                  pathname: "/edit-product", 
                  product: product
                }}>
                  <button className="button is-small is-warning">Edit Product</button>
                </Link>
                {" "}
                <button 
                  className="button is-small is-danger"
                  onClick={() => props.createDeleteModal(product)}
                >Delete Product</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
/**/
export default ManageProductItem;
