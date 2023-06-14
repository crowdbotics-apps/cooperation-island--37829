import { createContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { parseToken, userState } from "./libs/utils";
import { mapUserData } from "./funnels/v1";
import CILoader from "./shared/CILoader";
import HomePage from "./containers/HomePage";
import LoginBoard from "./containers/LoginBoard";
import LandingPage from "./containers/LandingPage";
import UserDetails from "./containers/UserDetails";
import AvatarPage from "./containers/AvatarPage";
import Dashboard from "./containers/Dashboard";
import ResetPassword from "./components/ResetPassword";
import ReadingPane from "./components/ReadingPane";
import "react-toastify/dist/ReactToastify.min.css";

const AppContext = createContext();

const App = () => {
  const localData = parseToken(localStorage["UserState"]);

  const [user, setUser] = useState(localData ? mapUserData(localData) : userState);

  const [BGM, setBGM] = useState(false);

  const [howler, setHowler] = useState({});

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    window.setLoader = setLoader;
  }, []);

  const handleUser = (data) => {
    setUser({
      ...user,
      ...data
    });
  }

  const handleHowler = (data) => {
    setHowler({
      ...howler,
      ...data
    });
  }  

  const getRoutes = () => {
    if (user.active) {
      if (user.access)
        return <Switch>
          <Route path="/home" component={Dashboard} />
          <Route path="/avatar" component={AvatarPage} />
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
        <Route path="/reset-password/:id" component={ResetPassword} />
        <Route path="/terms-conditions" component={ReadingPane} />
        <Route path="/privacy" component={ReadingPane} />
        <Redirect to="/" />
      </Switch>;
    }
  }

  return <AppContext.Provider value={{ BGM, howler, user, setBGM, setHowler: handleHowler, setUser: handleUser }}>
    <Route path="/" component={HomePage} />
    <Switch>
      {getRoutes()}
      <Redirect to="/" />
    </Switch>
    <CILoader open={loader} />
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      closeButton={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      draggable={false}
    />
  </AppContext.Provider>
}

export { AppContext };

export default App;
