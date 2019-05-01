import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cc from 'util/combine-class';
import styles from './styles.module.css';

class Modal extends Component {
  render() {
    return (
      <div className={cc(styles.modal, this.props.className)}>
        <div className={styles.modalInner}>
          {this.props.onClose && <button>x</button>}
          {this.props.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Modal;
