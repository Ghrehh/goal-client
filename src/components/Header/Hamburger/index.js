import React, { Component } from "react";
import styles from "./styles.module.css";
import PropTypes from 'prop-types';

class Hamburger extends Component {
  render() {
    return (
      <svg
        onClick={this.props.onClick}
        className={`${styles.hamburger} ${this.props.className}`}
        width="131px"
        height="131px"
        viewBox="0 0 131 131"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <rect
            id="Rectangle"
            fill="#000000"
            x="4"
            y="8"
            width="123"
            height="22"
          />
          <rect
            id="Rectangle"
            fill="#000000"
            x="4"
            y="55"
            width="123"
            height="22"
          />
          <rect
            id="Rectangle"
            fill="#000000"
            x="4"
            y="101"
            width="123"
            height="22"
          />
        </g>
      </svg>
    );
  }
}

Hamburger.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Hamburger;
