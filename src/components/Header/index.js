import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "components/Button";
import Hamburger from './Hamburger';
import styles from "./styles.module.css";

class Header extends Component {
  state = { open: false }

  handleHamburgerClick = () => {
    this.setState({ open: !this.state.open });
  }

  closeMenu = () => {
    this.setState({ open: false });
  }

  render() {
    const headerContentsClass = `
      ${styles.headerContents}
      ${this.state.open && styles.headerContentsMobile}
    `;

    return (
      <header className={styles.header}>
        <Hamburger
          className={styles.hamburger}
          onClick={this.handleHamburgerClick}
        />

        <div className={headerContentsClass}>
          <label htmlFor="selected-date" className={styles.selectedDateLabel}>
            Selected Date
          </label>

          <input
            className={styles.selectedDate}
            name="selected-date"
            type="date"
            value={this.props.selectedDate}
            onChange={this.props.handleDateChange}
          />

          <Link
            onClick={this.closeMenu}
            className={styles.link}
            to={"/new-goal"}
          >
            New Goal
          </Link>

          <Link
            onClick={this.closeMenu}
            className={styles.link}
            to={"/"}
          >
            View Goals
          </Link>

          <Button onClick={this.props.logOut} className={styles.button}>
            Log Out
          </Button>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  logOut: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired,
  handleDateChange: PropTypes.func.isRequired
};

export default Header;
