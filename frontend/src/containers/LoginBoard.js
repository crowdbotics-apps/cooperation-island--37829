import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapUserData } from "../funnels/v1";
import { formatAge, formatUsername, parseToken, validateEmail } from "../libs/utils";
import { login as handleLogin, signup as handleSignup, resetPassword } from "../services/v1";
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
        top: "3vh",
        left: "110vw",
        height: "94vh",
        width: "30vw",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "30vw 94vh"
    },
    guide: {
        position: "absolute",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
    },
    guide2: {
        position: "absolute",
        top: "44vh",
        left: "50vw",
        height: "70vh",
        width: "24vw",
        transform: "scale(0)"
    },
    header: {
        marginTop: "12vh",
        marginLeft: "5.5vw",
        height: "10vh",
        width: "20vw",
        background: `url(${HeaderImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "20vw 10vh"
    },
    title: {
        "&#sign-up": {
            marginLeft: "12.2vw"
        },
        position: "absolute",
        marginTop: "2.55vh",
        marginLeft: "3.48vw",
        fontSize: "3.3vh",
        textAlign: "center"
    },
    tab: {
        position: "absolute",
        top: "10.25vh",
        height: "10vh",
        width: "10vw",
        background: `url(${SwitchImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "10vw 10vh"
    },
    body: {
        "& > div": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "62vh",
            width: "25.75vw"
        },
        position: "relative",
        marginLeft: "2.7vw",
        overflow: "hidden",
        textAlign: "center",
        height: "62vh",
        width: "25.75vw"
    },
    signInSection: {
        "& button": {
            marginTop: "3vh",
            width: "auto"
        },
        "& input": {
            marginTop: "0.7vh"
        },
        "& label": {
            "&:nth-child(5)": {
                marginTop: "5.6vh"
            },
            marginTop: "2.7vh"
        },
        position: "absolute",
        zIndex: 2,
        marginTop: "2vh"
    },
    signUpSection: {
        "& button": {
            marginTop: "3vh",
            width: "auto"
        },
        "& input": {
            marginBottom: "1vh"
        },
        position: "absolute",
        zIndex: 2,
        marginTop: "4vh"
    },
    resetSection: {
        "& label": {
            "&:first-child": {
                fontSize: "4.5vh",
                fontWeight: "bold",
                letterSpacing: "0.1vw"
            },
            "&:nth-child(2)": {
                marginTop: "8vh",
                marginBottom: "2vh"
            }
        },
        "& button": {
            margin: "0vh 3vw"
        },
        "& input": {
            marginBottom: "6vh",
        },
        position: "absolute",
        opacity: 0,
        rotate: "-90deg",
        height: "44vh !important",
        width: "36vw !important",
        marginTop: "25vh",
        marginLeft: "-6.5vw"
    },
    grid: {
        "& input": {
            "&:first-child": {
                height: "11.7vh",
                width: "8.7vw"
            },
            height: "10.5vh",
            width: "3vw"
        },
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
    panel: {
        display: "flex",
        marginTop: "0.5vh"
    },
    link: {
        fontSize: "2vh"
    },
    pipe: {
        margin: "-0.25vh 0.5vw",
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
            left: active ? "6.3vw" : "14.6vw",
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
            marginLeft: active ? "0vw" : "-27.6vw",
            easing: "linear",
            duration: 250
        });
        anime({
            targets: `.${cls.signUpSection}`,
            marginLeft: active ? "27.6vw" : "0vw",
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

    const handleClick = (path) => () => {
        anime
            .timeline()
            .add({
                targets: "#guide",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#board",
                left: "110vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=2000")
            .finished.then(() => {
                history.push(path);
                showReadingPane();
            });
    }

    const handleClose = () => {
        anime({
            targets: "#guide",
            scaleX: -1,
            scaleY: 1,
            left: "6vw",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#guide2",
            scale: 0,
            top: "44vh",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#board",
            top: "3vh",
            left: "63vw",
            height: "94vh",
            width: "30vw",
            backgroundSize: "30vw 94vh",
            rotate: "0deg",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.body}`,
            height: "62vh",
            width: "25.75vw",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.header}`,
            height: "10vh",
            marginTop: "12vh",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.resetSection}`,
            opacity: 0,
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
            targets: [`.${cls.resetSection}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            zIndex: (_, i) => i ? 2 : 1,
            duration: 0
        });
    }

    const handleLink = () => {
        anime({
            targets: "#guide",
            scaleX: [-1, 0],
            scaleY: 0,
            left: "30vw",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#guide2",
            scale: [0, 1],
            top: "4vh",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#board",
            top: "20vh",
            left: "38vw",
            height: "96vh",
            width: "26vw",
            backgroundSize: ["30vw 94vh", "26vw 96vh"],
            rotate: "90deg",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.body}`,
            height: "87vh",
            width: "26.5vw",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.header}`,
            height: "0vh",
            marginTop: "0vh",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.resetSection}`,
            opacity: 1,
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: [`.${cls.header}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            opacity: 0,
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: [`.${cls.resetSection}`, `.${cls.signInSection}`, `.${cls.signUpSection}`],
            zIndex: (_, i) => i ? 1 : 2,
            duration: 0
        });
    }

    const handleSend = () => {
        if (validateUsername()) {
            resetPassword(username)
                .then(() => {
                    toast.success("Reset-Password link has been sent to your Email.");
                    handleClose();
                })
                .catch(() => {
                    toast.error("The Username does not exist.");
                });
        }
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

    const handleSwitch = () => {
        setActive(!active);
    }

    const playAnimations = (data) => {
        if (data.access && data.details && !data.avatar) {
            anime({
                targets: "#logo",
                left: "-50vw",
                easing: "easeInQuint",
                duration: 2000
            });
        }
        anime({
            targets: "#guide",
            left: "-30vw",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#board",
            left: "110vw",
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
        else if (!parseInt(signup.age))
            toast.error("The Age cannot be empty or 0.");
        else if (parseInt(signup.age) > 18)
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
                    <div className={cls.panel}>
                        <CILink className={cls.link} onClick={handleClick("/terms-conditions")}>Terms & Conditions</CILink>
                        <CILabel className={cls.pipe}>|</CILabel>
                        <CILink className={cls.link} onClick={handleClick("/privacy")}>Privacy Policy</CILink>
                    </div>
                </div>
                <div className={cls.resetSection}>
                    <CILabel>Forgot Password?</CILabel>
                    <CILabel>Username</CILabel>
                    <CIInput onChange={handleChange("username")} onEnter={handleSend} value={username} />
                    <div>
                        <CIButton onClick={handleSend}>Send</CIButton>
                        <CIButton onClick={handleClose}>Cancel</CIButton>
                    </div>
                </div>
            </div>
        </div>
    </div >
}

export default LoginBoard;