import React, { Component } from 'react';
import LocalStorage from 'util/LocalStorage';
import LogIn from 'components/LogIn';
import Header from 'components/Header';
import Goals from 'components/Goals';
import Goal from 'components/Goal';
import CreateGoal from 'components/CreateGoal';
import AuthContext from 'components/context/Auth';
import SelectedDateContext from 'components/context/SelectedDate';
import { Route, BrowserRouter as Router } from 'react-router-dom';

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

  renderGoalsPage() {
    return (
      <React.Fragment>
        <Goals />
        <CreateGoal />
      </React.Fragment>
    )
  }

  render() {
    if (this.state.rememberToken && this.state.userId) {
      return (
        <AuthContext.Provider value={this.auth()}>
          <SelectedDateContext.Provider value={this.state.selectedDate}>
            <Header
              logOut={this.logOut}
              selectedDate={this.state.selectedDate}
              handleDateChange={this.handleDateChange}
            />
            <Router>
              <React.Fragment>
                <Route exact path="/" render={this.renderGoalsPage} />
                <Route exact path="/goal/:goalId" component={Goal} />
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
