import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapUserData } from "../funnels/v1";
import { formatAge, formatUsername, parseToken, validateEmail } from "../libs/utils";
import { login as handleLogin, signup as handleSignup } from "../services/v1";
import { showAvatarPage, showDetailsPage, showHomePage, showLandingPage, showReadingPane } from "../libs/animations";
import BoardImg from "../assets/images/Board.png";
import HeaderImg from "../assets/images/Header.png";
import SwitchImg from "../assets/images/Switch.png";
import CIButton from "../shared/CIButton";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import CILink from "../shared/CILink";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles({
    board: {
        position: "absolute",
        top: "3%",
        left: "110%",
        height: "94vh",
        width: "30vw",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
    },
    guide: {
        position: "absolute",
        top: "33.5%",
        left: "-30%",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
    },
    guide2: {
        position: "absolute",
        top: "44%",
        left: "50%",
        height: "70vh",
        width: "24vw",
        transform: "scale(0)"
    },
    header: {
        marginTop: "18.4%",
        marginLeft: "18.4%",
        height: "10vh",
        width: "75vw",
        background: `url(${HeaderImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    },
    title: {
        "&#sign-up": {
            marginLeft: "38.5%"
        },
        position: "absolute",
        marginTop: "4%",
        marginLeft: "11.5%",
        fontSize: "3.3vh",
        textAlign: "center"
    },
    tab: {
        position: "absolute",
        top: "11.1%",
        left: "14.3%",
        height: "10vh",
        width: "10vw",
        background: `url(${SwitchImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    },
    body: {
        position: "relative",
        height: "61vh",
        marginLeft: "8%",
        marginRight: "4%",
        overflow: "hidden",
        textAlign: "center"
    },
    signInSection: {
        "& button": {
            marginTop: "2vh",
            marginLeft: "1%"
        },
        "& input": {
            marginTop: "0.7vh"
        },
        "& label": {
            "&:nth-child(5)": {
                marginTop: "5.6vh",
                marginLeft: "1%"
            },
            marginTop: "2.7vh"
        },
        position: "absolute",
        zIndex: 2,
        marginTop: "2vh",
        marginLeft: "12.5%"
    },
    signUpSection: {
        position: "absolute",
        "& button": {
            width: "9.65vw",
            marginTop: "1vh",
        },
        "& input": {
            marginBottom: "1vh"
        },
        "& label": {
            marginLeft: "3%"
        },
        zIndex: 2,
        marginTop: "5%",
        marginLeft: "105%"
    },
    resetSection: {
        position: "absolute",
        "& label": {
            "&:first-child": {
                fontSize: "4.5vh",
                fontWeight: "bold",
                letterSpacing: "0.1vw"
            },
            "&:nth-child(2)": {
                marginTop: "8vh",
                marginBottom: "0.7vh"
            },
            width: "100%"
        },
        "& button": {
            width: "45%"
        },
        "& div": {
            display: "flex",
            justifyContent: "space-between",
            width: "95.5%"
        },
        "& input": {
            marginBottom: "3vh",
            marginLeft: "2.5vw"
        },
        opacity: 0,
        rotate: "-90deg",
        height: "43.3vh",
        width: "105%",
        marginTop: "9%",
        marginLeft: "-100%"
    },
    grid: {
        display: "flex"
    },
    age: {
        marginTop: "0.6vh",
        marginLeft: "1vw",
        width: "2.7vw"
    },
    email: {
        width: "9.1vw"
    },
    footerText: {
        fontSize: "2vh",
        marginTop: "1.7vh",
        marginBottom: "-1.33vh"
    },
    link: {
        display: "inline",
        fontSize: "2vh"
    },
    pipe: {
        display: "inline",
        fontSize: "2.5vh"
    }
});

const LoginBoard = () => {
    const cls = useStyles();

    const history = useHistory();

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

    const [active, setActive] = useState(window.location.pathname === "/login");

    const { setBGM, setHowler, setUser } = useContext(AppContext);

    useEffect(() => {
        history.push(active ? "/login" : "/signup");

        anime({
            targets: `.${cls.tab}`,
            left: active ? "6.2vw" : "14.3vw",
            easing: "linear",
            duration: 250
        });
        anime({
            targets: "#sign-in",
            color: active ? "#7C382D" : "#CEB891",
            easing: "linear",
            duration: 250
        });
        anime({
            targets: "#sign-up",
            color: active ? "#CEB891" : "#7C382D",
            easing: "linear",
            duration: 250
        });
        anime({
            targets: `.${cls.signInSection}`,
            marginLeft: active ? "12.5%" : "-105%",
            easing: "linear",
            duration: 250
        });
        anime({
            targets: `.${cls.signUpSection}`,
            marginLeft: active ? "105%" : "12.5%",
            easing: "linear",
            duration: 250
        });
    }, [active]);

    const handleChange = (prop, parent) => (event) => {
        if (prop === "age")
            setSignup({
                ...signup,
                age: formatAge(event.target.value, signup.age)
            });
        else if (parent === "login")
            setLogin({
                ...login,
                [prop]: prop === "username" ? formatUsername(event.target.value, login[prop]) : event.target.value
            });
        else if (parent === "signup")
            setSignup({
                ...signup,
                [prop]: prop === "username" ? formatUsername(event.target.value, signup[prop]) : event.target.value
            });
        else
            setUsername(formatUsername(event.target.value, username));
    }

    const handleSwitch = () => {
        setActive(!active);
    }

    const handleLink = () => {
        anime({
            targets: "#guide",
            scaleX: [-1, 0],
            scaleY: 0,
            left: "30%",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#guide2",
            scale: [0, 1],
            top: "2%",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#board",
            top: "16%",
            left: "38%",
            width: "27vw",
            height: "97vh",
            rotate: 90,
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: [`.${cls.header}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            opacity: 0,
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.body}`,
            height: "80vh",
            duration: 0
        });
        anime({
            targets: [`.${cls.resetSection}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            zIndex: (_, i) => i ? 1 : 2,
            duration: 0
        });
        anime({
            targets: `.${cls.resetSection}`,
            opacity: 1,
            marginLeft: "1%",
            easing: "easeOutQuint",
            duration: 2000
        });
    }

    const handleClick = (path) => () => {
        anime
            .timeline()
            .add({
                targets: "#guide",
                left: "-30%",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#board",
                left: "110%",
                easing: "easeInQuint",
                duration: 2000
            }, "-=2000")
            .finished.then(() => {
                history.push(path);
                showReadingPane();
            });
    }

    const handleCancel = () => {
        anime({
            targets: "#guide",
            scaleX: -1,
            scaleY: 1,
            left: "6%",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#guide2",
            scale: 0,
            top: "44%",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#board",
            top: "3%",
            left: "63%",
            width: "30vw",
            height: "94vh",
            rotate: 0,
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: [`.${cls.header}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            opacity: 1,
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.body}`,
            height: "61vh",
            duration: 0
        });
        anime({
            targets: [`.${cls.resetSection}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            zIndex: (_, i) => i ? 2 : 1,
            duration: 0
        });
        anime({
            targets: `.${cls.resetSection}`,
            opacity: 0,
            marginLeft: "-100%",
            easing: "easeOutQuint",
            duration: 2000
        });
    }

    const handleSign = (isLogin) => () => {
        if (isLogin) {
            if (validateLogin()) {
                handleLogin(login)
                    .then(({ data }) => {
                        const userData = parseToken(data.user);

                        if (userData) {
                            localStorage["AccessToken"] = data.token;
                            localStorage["UserState"] = data.user;
                            playAnimations(mapUserData(userData));
                        }
                        else
                            toast.error("Something went wrong.");
                    })
                    .catch(() => {
                        toast.error("The Username or Password is incorrect.");
                    });
            }
        }
        else {
            if (validateSignup()) {
                handleSignup(signup)
                    .then(({ data }) => {
                        const userData = parseToken(data.user);

                        if (userData) {
                            localStorage["AccessToken"] = data.token;
                            localStorage["UserState"] = data.user;
                            playAnimations(mapUserData((userData)));
                        }
                        else
                            toast.error("Something went wrong.");
                    })
                    .catch(() => {
                        toast.error("Something went wrong.");
                    });
            }
        }
    }

    const handleSend = () => {
        if (validateUsername()) {
            toast.success("Reset Password link has been sent to your Email.");
            handleCancel();
        }
    }

    const playAnimations = (data) => {
        if (data.access && data.details && !data.avatar) {
            anime({
                targets: "#logo",
                left: "-50%",
                easing: "easeInQuint",
                duration: 2000
            });
        }
        anime({
            targets: "#guide",
            left: "-30%",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#board",
            left: "110%",
            easing: "easeInQuint",
            duration: 2000
        })
            .finished.then(() => {
                setUser(data);
                setBGM(true);
                setHowler({
                    welcome: new Howl({
                        src: [require("../assets/sounds/Welcome.mp3")],
                        autoplay: true,
                        loop: true
                    })
                });

                if (data.access) {
                    if (data.details) {
                        if (data.avatar) {
                            history.push("/home");
                            showHomePage();
                        }
                        else {
                            history.push("/avatar");
                            showAvatarPage();
                        }
                    }
                    else {
                        history.push("/details");
                        showDetailsPage();
                    }
                }
                else {
                    history.push("/access");
                    showLandingPage();
                }
            });
    }

    const validateLogin = () => {
        if (login.username.length < 6)
            toast.error("Username must be more than 5 characters.");
        else if (login.password.trim().length < 8)
            toast.error("Password must be at least 8 characters.");
        else
            return true;
    }

    const validateSignup = () => {
        if (signup.username.length < 6)
            toast.error("Username must be more than 5 characters.");
        else if (signup.password.trim().length < 8)
            toast.error("Password must be at least 8 characters.");
        else if (!validateEmail(signup.email))
            toast.error("The Email is invalid.");
        else if (!signup.age)
            toast.error("The Age cannot be empty or 0");
        else if (signup.age > 18)
            toast.error("Children above 18 are not allowed.");
        else
            return true;
    }

    const validateUsername = () => {
        if (username.length < 6)
            toast.error("Username must be more than 5 characters.");
        else
            return true;
    }

    return <div>
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_1.png")} />
        <img className={cls.guide2} id="guide2" src={require("../assets/avatars/Avatar_2.png")} />
        <div className={cls.board} id="board">
            <div className={clsx(cls.header, "pointer")} onClick={handleSwitch}>
                <div className={clsx(cls.tab, "pointer")} />
                <CILabel className={clsx(cls.title, "pointer")} id="sign-in">
                    Sign In
                </CILabel>
                <CILabel className={clsx(cls.title, "pointer")} id="sign-up">
                    Sign Up
                </CILabel>
            </div>
            <div className={cls.body}>
                <div className={cls.signInSection}>
                    <CILabel>Username</CILabel>
                    <CIInput onChange={handleChange("username", "login")} onEnter={handleSign(true)} value={login.username} />
                    <CILabel>Password</CILabel>
                    <CIInput onChange={handleChange("password", "login")} onEnter={handleSign(true)} type="password" value={login.password} />
                    <CILink onClick={handleLink}>Forgot Password?</CILink>
                    <CIButton onClick={handleSign(true)}>Sign In</CIButton>
                </div>
                <div className={cls.signUpSection}>
                    <CIInput onChange={handleChange("username", "signup")} onEnter={handleSign(false)} placeholder="Username" value={signup.username} />
                    <CIInput onChange={handleChange("password", "signup")} onEnter={handleSign(false)} placeholder="Password" type="password" value={signup.password} />
                    <div className={cls.grid}>
                        <CIInput className={cls.email} onChange={handleChange("email", "signup")} onEnter={handleSign(false)} placeholder="Email" sm value={signup.email} />
                        <CIInput className={cls.age} onChange={handleChange("age", "signup")} onEnter={handleSign(false)} placeholder="Age" xs value={signup.age} />
                    </div>
                    <CIButton onClick={handleSign(false)}>Sign Up</CIButton>
                    <CILabel className={cls.footerText}>
                        By Signing Up, you are agreeing to our
                    </CILabel>
                    <CILink className={cls.link} onClick={handleClick("/terms-conditions")}>Terms & Conditions</CILink>
                    <CILabel className={cls.pipe}>|</CILabel>
                    <CILink className={cls.link} onClick={handleClick("/privacy")}>Privacy Policy</CILink>
                </div>
                <div className={cls.resetSection}>
                    <CILabel>Forgot Password?</CILabel>
                    <CILabel>Username</CILabel>
                    <CIInput onChange={handleChange("username")} onEnter={handleSend} value={username} />
                    <div>
                        <CIButton onClick={handleSend}>Send</CIButton>
                        <CIButton onClick={handleCancel}>Cancel</CIButton>
                    </div>
                </div>
            </div>
        </div>
    </div >
}

export default LoginBoard;