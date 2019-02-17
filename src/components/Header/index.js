import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <label
          for="selected-date"
          className={styles.selectedDateLabel}
        >
          Selected Date
        </label>

        <input
          name="selected-date"
          type="date"
          value={this.props.selectedDate}
          onChange={this.props.handleDateChange}
        />

        <button
          onClick={this.props.logOut}
          className={styles.button}
        >
          Log Out
        </button>
      </header>
    );
  }
}

Header.propTypes = {
  logOut: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired,
  handleDateChange: PropTypes.func.isRequired
}

export default Header;
