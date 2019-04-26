import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import styles from "./styles.module.css";

export default class Tick extends PureComponent {
  get tickCoverClass() {
    return (
      `
        ${styles.background}
        ${styles.tickCover}
        ${this.props.checked && styles.tickCoverChecked}
      `
    );
  }

  render() {
    return (
      <svg
        width="35px"
        height="35px"
        viewBox="0 0 630 630"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <rect
            className={styles.background}
            fill="#8D5687"
            x="0"
            y="0"
            width="630"
            height="630"
            rx="50"
          />
          <polyline
            className={styles.tick}
            stroke="none"
            strokeWidth="100"
            points="109 293.646424 229.186565 440 529 152"
          />
          <rect
            className={this.tickCoverClass}
            fill="#8D5687"
            x="0"
            y="0"
            width="630"
            height="630"
            rx="50"
          />
        </g>
      </svg>
    )
  }
}

Tick.propTypes = {
  checked: PropTypes.bool.isRequired
}
