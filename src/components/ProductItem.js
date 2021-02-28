import React from "react";

const ProductItem = props => {
  const { product } = props;
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
              {(props.productAmountInCart(product) !== product.stock && product.stock > 0) ? (
                <button
                  className="button is-small is-outlined is-primary is-pulled-right"
                  onClick={() =>
                    props.addToCart({
                      id: product.name,
                      product,
                      amount: 1
                    })
                  }
                >
                  Add to Cart
                </button>) : (
                <button
                  className="button is-small is-outlined is-primary is-pulled-right"
                  disabled
                >
                  Add to Cart
              </button>)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
