import { createContext, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./containers/HomePage";
import LoginBoard from "./containers/LoginBoard";
import LandingPage from "./components/LandingPage";
import Dashboard from "./containers/Dashboard";
import ResetPassword from "./components/ResetPassword";
import ReadingPane from "./components/ReadingPane";
import "react-toastify/dist/ReactToastify.min.css";

const AppContext = createContext();

const App = () => {
  const [user, setUser] = useState({
    id: "",
    access: false,
    active: false,
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
        return <Route path="/home" component={Dashboard} />
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
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      closeButton={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      draggable={false}
      theme="dark"
    />
  </AppContext.Provider>
}

export { AppContext };

export default App;
