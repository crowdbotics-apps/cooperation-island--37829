import { createContext, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import HomePage from "./containers/HomePage";
import LoginBoard from "./containers/LoginBoard";
import LandingPage from "./containers/LandingPage";
import UserDetails from "./containers/UserDetails";
import Avatar from "./containers/Avatar";
import Dashboard from "./containers/Dashboard";
import ResetPassword from "./components/ResetPassword";
import ReadingPane from "./components/ReadingPane";

const AppContext = createContext();

const App = () => {
  const [user, setUser] = useState({
    id: "",
    access: true,
    active: true,
  });

  const handleUser = (data) => {
    setUser({
      ...user,
      ...data
    });
  }

  const getRoutes = () => {
    if (user.active) {
      if (user.access)
        return <Switch>
          <Route path="/home" component={Dashboard} />
          <Route path="/avatar" component={Avatar} />
          <Route path="/details" component={UserDetails} />
          <Redirect to="/" />
        </Switch>
      else
        return <Route path="/access" component={LandingPage} />
    }
    else {
      return <Switch>
        <Route path="/login" component={LoginBoard} />
        <Route path="/signup" component={LoginBoard} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/terms-conditions" component={ReadingPane} />
        <Route path="/privacy" component={ReadingPane} />
        <Redirect to="/" />
      </Switch>;
    }
  }

  return <AppContext.Provider value={{ user, setUser: handleUser }}>
    <Route path="/" component={HomePage} />
    <Switch>
      {getRoutes()}
      <Redirect to="/" />
    </Switch>
  </AppContext.Provider>
}

export { AppContext };

export default App;
