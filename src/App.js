import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode"; // JWT = JSON Web Tokens, see jwt.io

import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import ManageProducts from './components/ManageProducts';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';

import Context from "./Context";

// CSS is handled by bulma.css OR done manually in index.css
// bulma CSS documentation: https://bulma.io/documentation/overview/start/

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {}, // NOTE items in cart are referenced by cart[item.name] NOT cart[item.id]!!!!
      products: [],
      // modalState: false,
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() { // loads the last session from local storage
    // async because we need to request from /products and wait for the data
    //  before sticking it into the state.
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");

    const products = await axios.get("http://localhost:3001/products");
    user = user ? JSON.parse(user) : null;
    cart = cart ? JSON.parse(cart) : {}; // empty object, NOT null

    this.setState({ user, products: products.data, cart });
  } 

  // **********************************************************************
  // SESSION **************************************************************
  // **********************************************************************

  login = async (email, password) => {
    const res = await axios.post ( // Ajax request
      'http://localhost:3001/login',
      { email, password }
    ).catch((res) => {
      return{ status: 401, message: "Unauthorized" }
    });

    if(res.status === 200) {
      const { email } = jwt_decode(res.data.accessToken);
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === "admin@example.com" ? 0 : 1 // HACKED, change later!!!!!!
        // NOTE: if admin resource requests are validated on the server this
        //       could potentially work, but it's still bad.
      }

      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  logout = e => { // e is a SyntheticEvent, see reactjs.org/docs/events.html
    e.preventDefault(); // must be called explicitly, see reactjs.org/docs/handling-events.html
    this.setState({ user: null});
    localStorage.removeItem("user");
  };

  // **********************************************************************
  // PRODUCT MANAGEMENT ***************************************************
  // **********************************************************************

  addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    this.setState({ products }, () => callback && callback());
  };

  editProduct = (originalProduct, editedProduct, callback) => {
    let products = this.state.products.slice();
    let pIndex = products.findIndex(p => p === originalProduct);
    products[pIndex] = editedProduct;
    this.setState({ products }, () => callback && callback());
  };

  deleteProduct = (product, callback) => {
    let products = this.state.products.slice();
    products = products.filter(p => p !== product);
    this.setState({ products });
  };

  productAmountInCart = p => { 
  // used to indicate quantity of items in cart on product page
    let cart = this.state.cart;
    if(cart[p.name]) {
      return cart[p.name].amount;
    }
    else return 0;
  }

  // **********************************************************************
  // CART MANAGEMENT ******************************************************
  // **********************************************************************

  addToCart = cartItem => {
    let cart = this.state.cart;
    if(cart[cartItem.id]) { // if item exists in cart already, id as key
      cart[cartItem.id].amount += cartItem.amount; // increment quantity
    } else { // otherwise, add a new one to the cart
      cart[cartItem.id] = cartItem;
    }
    // limit the quantity in cart to the quantity available
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    // save it
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeFromCart = cartItemId => {
    let cart = this.state.cart;
    delete cart[cartItemId]; // remove it
    // save it
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {}; // set to empty object
    // save it
    localStorage.removeItem("cart");
    this.setState({ cart })
  };

  checkout = () => {
    // checkout requires a user
    if(!this.state.user) {
      // if no valid user, send them to login
      this.routerRef.current.history.push("/login");
      return;
    };

    const cart = this.state.cart;

    // change stock and write to backend
    const products = this.state.products.map(p => {
      if(cart[p.name]) {
        p.stock -= cart.[p.name].amount;

        axios.put(`http://localhost:3001/products/${p.id}`, {...p});
      }
      return p;
    });

    this.setState({ products });
    this.clearCart();
  };

  render() {
    /*
      Context.Provider has the data (state) and methods passed as a property.
      Router (BrowserRouter) wraps our app navigation.
      routerRef gives access to the router from the rest of the App component.
      Switch, Route, Link and Router (BrowserRouter) are all React components.
    */
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          addProduct: this.addProduct,
          editProduct: this.editProduct,
          deleteProduct: this.deleteProduct,
          clearCart: this.clearCart,
          checkout: this.checkout,
          productAmountInCart: this.productAmountInCart,
        }}
      >
        <Router ref={this.routerRef}>
          <div className="App">
            <nav
              className="navbar container"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <b className="navbar-item is-size-4 ">Faux Clothing</b>
                <label
                  role="button"
                  class="navbar-burger burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({ showMenu: !this.state.showMenu });
                  }}
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </label>
              </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <Link to="/add-product" className="navbar-item">
                    Add Product
                  </Link>
                )}
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <Link to="/manage-products" className="navbar-item">
                    Manage Products
                  </Link>
                )}
                <Link to="/cart" className="navbar-item">
                  Cart
                  <span
                    className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                    { Object.keys(this.state.cart).length }
                  </span>
                </Link>
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                ) : (
                  <Link to="/products" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                )}
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={ProductList} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route exact path="/edit-product" component={EditProduct} />
              <Route exact path="/manage-products" component={ManageProducts} />
              <Route exact path="/products" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    ); // return
  } // render
} // App
