import React, { Component } from 'react';
import LocalStorage from 'util/LocalStorage';
import LogIn from 'components/LogIn';
import Header from 'components/Header';
import Goals from 'components/Goals';
import Goal from 'components/Goal';
import NewGoal from 'components/NewGoal';
import NewNote from 'components/NewNote';
import AuthContext from 'components/context/Auth';
import SelectedDateContext from 'components/context/SelectedDate'; import { Route, BrowserRouter as Router } from 'react-router-dom';

const defaultDate = () => {
  const today = new Date()
  let month = today.getMonth() + 1
  month = month < 10 ? "0" + String(month) : String(month)

  let date = today.getDate()
  date = date < 10 ? "0" + String(date) : String(date)

  return `${today.getFullYear()}-${month}-${date}`;
}


class App extends Component {
  state = {
    selectedDate: defaultDate()
  }

  componentDidMount() {
    const rememberToken = LocalStorage.getItem('rememberToken')
    const userId = LocalStorage.getItem('userId')

    if (rememberToken && userId) this.setState({ rememberToken, userId })
  }

  handleDateChange = event => {
    event.preventDefault();
    this.setState({ selectedDate: event.target.value })
  }

  setAuth = ({ rememberToken, userId }) => {
    this.setState({ rememberToken, userId })

    LocalStorage.setItem('rememberToken', rememberToken)
    LocalStorage.setItem('userId', userId)
  }

  logOut = () => {
    this.setState({ rememberToken: undefined, userId: undefined })

    LocalStorage.setItem('rememberToken', undefined)
    LocalStorage.setItem('userId', undefined)
  }

  auth = () => ({
    rememberToken: this.state.rememberToken,
    userId: parseInt(this.state.userId, 10)
  })

  render() {
    if (this.state.rememberToken && this.state.userId) {
      return (
        <AuthContext.Provider value={this.auth()}>
          <SelectedDateContext.Provider value={this.state.selectedDate}>
            <Router>
              <React.Fragment>
                <Header
                  logOut={this.logOut}
                  selectedDate={this.state.selectedDate}
                  handleDateChange={this.handleDateChange}
                />
                <Route exact path="/" component={Goals} />
                <Route exact path="/new-goal" component={NewGoal} />
                <Route exact path="/goals/:goalId" component={Goal} />
                <Route exact path="/goals/:goalId/new-note" component={NewNote} />
              </React.Fragment>
            </Router>
          </SelectedDateContext.Provider>
        </AuthContext.Provider>
      )
    }

    return <LogIn setAuth={this.setAuth} />
  }
}

export default App;
