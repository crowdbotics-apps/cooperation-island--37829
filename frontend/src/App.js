import { createContext, useEffect, useRef, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Backdrop, makeStyles } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { anime, parseToken, userState } from "./libs/utils";
import { mapUserData } from "./funnels/v1";
import { Tooltip } from "react-tooltip";
import BoardImg from "./assets/images/Board-sm.png";
import CIButton from "./shared/CIButton";
import CILabel from "./shared/CILabel";
import CILoader from "./shared/CILoader";
import HomePage from "./containers/HomePage";
import LoginBoard from "./containers/LoginBoard";
import LandingPage from "./containers/LandingPage";
import UserDetails from "./containers/UserDetails";
import AvatarPage from "./containers/AvatarPage";
import Dashboard from "./containers/Dashboard";
import ShopPage from "./containers/ShopPage";
import ResetPassword from "./components/ResetPassword";
import ReadingPane from "./components/ReadingPane";
import Module_1 from "./modules/Module_1";
import Module_2 from "./modules/Module_2";
import Module_3 from "./modules/Module_3";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const AppContext = createContext();

const LoginContext = createContext();

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 10
  },
  board: {
    "& button": {
      backgroundSize: "10vw 7vh",
      width: "10vw",
      marginTop: "12vh",
    },
    "& label": {
      fontSize: "4.5vh",
      marginTop: "10vh",
      padding: "0vh 7vw"
    },
    position: "absolute",
    filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
    textAlign: "center",
    top: "32vh",
    left: "30vw",
    height: "36vh",
    width: "40vw",
    transform: "scale(0)",
    background: `url(${BoardImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "40vw 36vh"
  },
  tooltip: {
    background: theme.palette.primary.tooltip,
    color: theme.palette.primary.main,
    filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
    fontFamily: "Summer Show",
    opacity: 1
  }
}));

const App = () => {
  const cls = useStyles();

  const history = useHistory();

  const avatarRef = useRef();

  const modalRef = useRef();

  const localData = parseToken(localStorage["UserState"]);

  const [user, setUser] = useState(localData ? mapUserData(localData) : userState);

  const [BGM, setBGM] = useState(false);

  const [data, setData] = useState(null);

  const [howler, setHowler] = useState({});

  const [loader, setLoader] = useState(false);

  const [showBackdrop, hideBackdrop] = useState(false);

  const [tooltip, showTooltip] = useState(true);

  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const [signup, setSignup] = useState({
    username: "",
    password: "",
    email: "",
    age: ""
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    window.setLoader = setLoader;
    window.logOut = handleLogout;

    const handleBlock = history.block((_, action) => {
      if (action === "POP") {
        toast.error("The navigation request has been blocked.");
        return false;
      }
    });

    const handleListen = history.listen((location) => {
      window.top.history.replaceState({}, document.title, location.pathname);
    });

    return () => {
      handleBlock();
      handleListen();
    }
  }, []);

  const handleClick = () => {
    anime({
      targets: "#board11",
      scale: 0,
      easing: "easeInQuint",
      duration: 500,
      complete: () => {
        hideBackdrop(false);
        window.location.reload();
      }
    });
  }

  const handleLogout = () => {
    if (!modalRef.current)
      anime({
        targets: "#board11",
        scale: [0, 1],
        duration: 1000,
        begin: () => {
          hideBackdrop(true);
          localStorage.clear();
        }
      });

    modalRef.current = true;
  }

  const handleHowler = (data) => {
    setHowler({
      ...howler,
      ...data
    });
  }

  const handleUser = (data) => {
    setUser({
      ...user,
      ...data
    });
  }

  const handleModule = ({ location: { state } }) => {
    switch (state?.module) {
      case 1:
        return <Module_1 />;
      case 2:
        return <Module_2 />;
      case 3:
        return <Module_3 />;
      default:
        return <Redirect to="/" />;
    }
  }

  const getRoutes = () => {
    if (user.active) {
      if (user.access)
        return <Switch>
          <Route path="/details" component={UserDetails} />
          <Route path="/avatar" render={() => <AvatarPage ref={avatarRef} />} />
          <Route path={["/poster", "/shop"]} component={ShopPage} />
          <Route path="/home" component={Dashboard} />
          <Route path="/fish-mind-reading" render={handleModule} />
          <Route path="/tree-shaking" render={handleModule} />
          <Route path="/voice-your-values" render={handleModule} />
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
        <Route path="/consent" component={ReadingPane} />
        <Route path="/assent" component={ReadingPane} />
        <Redirect to="/" />
      </Switch>;
    }
  }

  return <AppContext.Provider value={{ avatarRef, BGM, data, howler, user, setBGM, setData, showTooltip, setHowler: handleHowler, setUser: handleUser }}>
    <LoginContext.Provider value={{ login, signup, username, setLogin, setSignup, setUsername }}>
      <Route path="/" component={HomePage} />
      <Switch>
        {getRoutes()}
        <Redirect to="/" />
      </Switch>
      <Backdrop className={cls.backdrop} open={showBackdrop}>
        <div className={cls.board} id="board11">
          <CILabel>
            Something went wrong. Please try logging again.
          </CILabel>
          <CIButton onClick={handleClick}>Login</CIButton>
        </div>
      </Backdrop>
      {loader && <CILoader />}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        closeButton={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
      />
      {tooltip && <Tooltip className={cls.tooltip} id="tooltip" />}
    </LoginContext.Provider>
  </AppContext.Provider>
}

export { AppContext, LoginContext };

export default App;
