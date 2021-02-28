import React from "react";
import withContext from "../withContext";

const Modal = ({ children, closeModal, modalState, title, footer }) => {
  if(!modalState) {
    return null;
  }
  
  return(
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title" style={{ textTransform: "capitalize" }}>{title}</p>
          <button className="delete" onClick={closeModal} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            {children}
          </div>
        </section>
        <footer className="modal-card-foot">
          {footer}
        </footer>
      </div>
    </div>
  );
}
// <a className="button" onClick={closeModal}>Cancel</a>

// Modal.propTypes = {
//   closeModal: React.PropTypes.func.isRequired,
//   modalState: React.PropTypes.bool.isRequired,
//   title: React.PropTypes.string
// }

export default withContext(Modal);