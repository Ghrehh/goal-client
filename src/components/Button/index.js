import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

class Button extends Component {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        className={`${this.props.className} ${styles.button}`}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Button;
