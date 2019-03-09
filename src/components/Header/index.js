import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import styles from './styles.module.css';

class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <label
          htmlFor="selected-date"
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

        <Link className={styles.newGoalLink} to={'/new-goal'}>New Goals</Link>
        <Link className={styles.goalsLink} to={'/'}>View Goals</Link>

        <Button
          onClick={this.props.logOut}
          className={styles.button}
        >
          Log Out
        </Button>
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
