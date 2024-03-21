import {Route, Switch} from 'react-router-dom'

import Assessment from './Components/Assessment'
import Login from './Components/Login'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/assessment" component={Assessment} />
    <Route exact path="/login" component={Login} />
  </Switch>
)

export default App
