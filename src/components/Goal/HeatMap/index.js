import React, { Component } from 'react';
import CompletionsModel from 'models/Completions';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import styles from './styles.module.css';

class HeatMap extends Component {
  state = {
    startDate: new Date().getFullYear(),
    endDate: new Date().getFullYear() + 1
  }

  changeDate = (event) => {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <div className={styles.heatMap}>
        <h2 className={styles.header}>Historical Completions</h2>
        <form className={styles.dateForm}>
          <label
            htmlFor="startDate"
            className={styles.label}
          >
            Start Year
          </label>
          <input
            className={styles.startDate}
            name='startDate'
            type="number"
            min="2020"
            max="3000"
            step="1"
            value={this.state.startDate}
            onChange={this.changeDate}
          />

          <label
            htmlFor="endDate"
            className={styles.label}
          >
            End Year
          </label>
          <input
            name='endDate'
            type="number"
            min="2019"
            max="3000"
            step="1"
            value={this.state.endDate}
            onChange={this.changeDate}
          />
        </form>

        <CalendarHeatmap
          startDate={`${this.state.startDate - 1}-12-31`}
          endDate={`${this.state.endDate - 1}-12-31`}
          values={this.props.completions.map(
            completion => ({ date: completion.completedAt})
          )}
        />
      </div>
    )
  }
}

HeatMap.propTypes = {
  completions: CompletionsModel.isRequired
}

export default HeatMap;
