import React, { useState } from "react";
import withContext from "../withContext";
import CartItem from "./CartItem";

const Cart = props => {
  const { cart } = props.context;
  const cartKeys = Object.keys(cart || {});

  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const calculateTotal = () => {
    let sum = 0;
    cartKeys.map(key => {
      const cartItem = cart[key];
      const cost = cartItem.product.price;
      const quantity = cartItem.amount;
      const costTotal = cost * quantity;
      sum += costTotal;
    })
    return sum.toFixed(2);
  }

  const costBreakdown = () => {
    const dropdownContent = cartKeys.map(key => {
      const cartItem = cart[key];
      const cost = cartItem.product.price;
      const quantity = cartItem.amount;
      const costTotal = cost * quantity;
      // some float conversion errors on edge cases, toFixed resolves those
      return (
        <div className="dropdown-item">
          <p><b style={{ textTransform: "capitalize" }}>{cartItem.product.name}</b></p>
          <p>${Number(cost).toFixed(2)} x {quantity}</p>
          <p><b>=${costTotal.toFixed(2)}</b></p>
        </div>
      )
    })
    //setTotal(sum); causes too many rerenders!!! not using state for this
    return dropdownContent;
  }

  return (
    <div>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">My Cart</h4>
          <hr />
        </div>
      </div>
      <br />
      <div className="container">
        {cartKeys.length ? (
          <div className="column columns is-multiline">
            {cartKeys.map(key => (
              <CartItem
                cartKey={key}
                key={key}
                cartItem={cart[key]}
                removeFromCart={props.context.removeFromCart}
              />
            ))}
            <div className="column is-12 is-clearfix">
              <br />
              <div className="is-pulled-right">
                <div className={"dropdown is-up" + (isDropdownActive ? " is-active" : "")}>
                  <div className="dropdown-trigger">
                    <button className="button is-primary"
                      aria-haspopup="true" 
                      aria-controls="dropdown-menu"
                      onClick={() => setIsDropdownActive(prevActive => prevActive = !prevActive)}
                      >
                        <span><b>Total: </b>
                          <span>${calculateTotal()}</span>
                        </span>
                        <span className="icon is-small">
                          <i className="fas fa-angle-up" aria-hidden="true"></i>
                        </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" 
                  id="dropdown-menu" 
                  role="menu"
                  onClick={() => setIsDropdownActive(prevActive => prevActive = !prevActive)}>
                    <div className="dropdown-content">
                      {costBreakdown()}
                    </div>
                  </div>
                </div>{" "}
                <button
                  onClick={props.context.clearCart}
                  className="button is-warning "
                >
                  Clear cart
                </button>{" "}
                <button
                  className="button is-success"
                  onClick={props.context.checkout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="column">
            <div className="title has-text-grey-light">No items in cart!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withContext(Cart);
// export default function Cart() {
// 	return <>Cart</>
// }

/*<div className="column is-one-third is-offset-8">
              <hr />
              <div className="box">
                test
              </div>
            </div>*/