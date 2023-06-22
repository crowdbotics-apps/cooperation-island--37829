import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Backdrop, makeStyles } from "@material-ui/core";
import { mapUserData } from "../funnels/v1";
import { formatCode, parseToken, userState } from "../libs/utils";
import { email, access as handleAccess, refresh as handleRefresh } from "../services/v1";
import { showDetailsPage, showLoginBoard } from "../libs/animations";
import BoardImg from "../assets/images/Board-alt.png";
import BoardLgImg from "../assets/images/Board-lg.png";
import CIButton from "../shared/CIButton";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import CILink from "../shared/CILink";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import anime from "animejs";

const useStyles = makeStyles({
    animal: {
        position: "absolute",
        zIndex: 2,
        top: "18vh",
        left: "48vw",
        height: "41vh",
        width: "11vw",
        transform: "scale(0)"
    },
    animal2: {
        position: "absolute",
        top: "140vh",
        left: "51vw",
        height: "16.7vh",
        width: "20vw"
    },
    guide: {
        position: "absolute",
        top: "38vh",
        left: "71vw",
        height: "58vh",
        width: "20vw",
        transform: "scale(0)"
    },
    guide2: {
        position: "absolute",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
    },
    board: {
        position: "absolute",
        top: "110vh",
        left: "42vw",
        height: "60vh",
        width: "50vw",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "50vw 60vh"
    },
    board2: {
        position: "absolute",
        top: "110vh",
        left: "34vw",
        height: "80vh",
        width: "54vw",
        textAlign: "center",
        background: `url(${BoardLgImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "54vw 80vh"
    },
    body: {
        "& input": {
            marginTop: "1vh",
            marginBottom: "5vh"
        },
        "& label:first-child": {
            "& label": {
                display: "inline",
                fontWeight: "bold"
            },
            fontSize: "2.5vh",
            letterSpacing: "0.1vw !important",
            paddingTop: "3vh",
            marginBottom: "12vh"
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0vh 6.5vw",
        height: "50vh",
        width: "37vw",
        marginTop: "8vh"
    },
    backdrop: {
        zIndex: 5
    },
    title: {
        fontSize: "4.5vh",
        fontWeight: "bold",
        letterSpacing: "0.1vw",
        marginTop: "10vh",
        marginBottom: "8vh"
    },
    content: {
        textAlign: "left",
        margin: "2vh 5vw 1vh 7vw"
    },
    button: {
        marginTop: "3vh",
        marginLeft: "1vw"
    },
    logout: {
        position: "absolute",
        top: "4vh",
        left: "100vw",
        width: "4vw"
    },
    music: {
        position: "absolute",
        top: "17vh",
        left: "100vw",
        width: "4vw"
    }
});

const LandingPage = () => {
    const cls = useStyles();

    const history = useHistory();

    const { BGM, howler, user, setUser } = useContext(AppContext);

    const [text, setText] = useState("");

    const [showBackdrop, hideBackdrop] = useState(true);

    useEffect(() => {
        window.RefreshTimer = setInterval(() => {
            if (localStorage["AccessToken"])
                handleRefresh()
                    .then(handleSave);
            else
                clearInterval(window.RefreshTimer);
        }, 1000);
    }, []);

    const handleClick = () => {
        anime({
            targets: "#guide2",
            left: "-30vw",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#backdrop",
            opacity: 0,
            easing: "linear",
            duration: 2000
        });
        anime
            .timeline()
            .add({
                targets: "#board5",
                top: "110vh",
                easing: "easeInQuint",
                duration: 2000,
                complete: () => {
                    hideBackdrop(false);
                }
            })
            .add({
                targets: "#animal2",
                top: "101vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#board4",
                top: "33.4vh",
                easing: "easeOutQuint",
                duration: 2000
            })
            .add({
                targets: "#guide",
                top: "-0.5vh",
                scale: [0, 1],
                easing: "easeOutQuint",
                duration: 2000
            }, "-=1000")
            .add({
                targets: "#animal",
                top: "0.3vh",
                scale: [0, 1],
                easing: "easeOutQuint",
                duration: 2000
            }, "-=1000");
    }

    const handleChange = (event) => {
        setText(formatCode(event.target.value, text));
    }

    const handleLogout = () => {
        if (BGM) {
            howler.welcome.fade(howler.welcome.volume(), 0, 1000);
            howler.dashboard?.fade(1, 0, 1000);
        }
        localStorage.clear();

        anime({
            targets: "#animal, #board4, #guide, #logout, #music",
            opacity: [1, 0],
            easing: "easeOutQuint",
            delay: 1000,
            duration: 1000
        })
            .finished.then(() => {
                setUser(userState);

                history.push("/login");
                showLoginBoard();
            });
    }

    const handleLink = (resend) => () => {
        email(resend)
            .then(({ data }) => {
                const userData = parseToken(data.user);

                if (userData) {
                    localStorage["UserState"] = data.user;
                    setUser(mapUserData((userData)));

                    toast.success("The User-Consent document has been sent to your registered email.");
                }
            })
            .catch(() => {
                toast.error("Something went wrong.");
            });
    }

    const handleSave = ({ data }) => {
        const userData = parseToken(data.user);

        if (userData && userData.consent_status) {
            clearInterval(window.RefreshTimer);
            localStorage["UserState"] = data.user;

            anime({
                targets: "#board4, #board5",
                top: "110vh",
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#animal2",
                top: "101vh",
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#backdrop",
                opacity: 0,
                easing: "linear",
                duration: 2000
            });
            anime({
                targets: "#guide2",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#logout, #music",
                left: "100vw",
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#guide, #animal",
                top: "38vw",
                opacity: [1, 0],
                easing: "easeInQuint",
                duration: 2000
            })
                .finished.then(() => {
                    setUser(mapUserData((userData)));

                    history.push("/details");
                    showDetailsPage();
                });
        }
    }

    const handleSubmit = () => {
        if (!text.length)
            toast.error("The Access Code cannot be empty.");
        else {
            handleAccess(text)
                .then(handleSave)
                .catch(() => {
                    toast.error("The Access Code is invalid.")
                });
        }
    }

    return <div>
        <img className={cls.animal} id="animal" src={require("../assets/animals/Animal_1.png")} />
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_6.png")} />
        <img className={cls.guide2} id="guide2" src={require("../assets/avatars/Avatar_9.png")} />
        <div className={cls.board} id="board4">
            <div className={cls.body}>
                {user.email ? <CILabel>Please Accept or <CILink onClick={handleLink(true)}>Click Here</CILink> to resend the <b className="typer">User-Consent</b> document, sent on your registered email or If you already have an <b className="typer">Access-Code</b>, Please enter below.</CILabel> :
                    <CILabel>Please <CILink onClick={handleLink(false)}>Click Here</CILink> to receive the <b className="typer">User-Consent</b> document or If you already have an <b className="typer">Access-Code</b>, Please enter below.</CILabel>}
                <CILabel>Access Code</CILabel>
                <CIInput onChange={handleChange} onEnter={handleSubmit} value={text} />
                <CIButton onClick={handleSubmit}>Submit</CIButton>
            </div>
        </div>
        <Backdrop className={cls.backdrop} id="backdrop" open={showBackdrop}>
            <img className={cls.animal2} id="animal2" src={require("../assets/animals/Animal_2.png")} />
            <div className={cls.board2} id="board5">
                <CILabel className={cls.title}>
                    Disclaimer
                </CILabel>
                <div className={cls.content}>
                    <h4 className="typer">Welcome to Cooperation Island!</h4>
                    <p className="typer">Cooperation Island is a set of different activities made for children, just like you. On Cooperation Island, you will have the opportunity to explore different activities. For the most part, you will make decisions that can help you earn shells.</p>
                    <p className="typer">Unlike some activities you may play, your responses to these questions and your decisions help us with scientific research. That means that your responses to these activities will be used to help us better understand how children and adults make decisions and think about the world and will likely be a part of a scientific research project, so you should take your decisions seriously. You can be a part of this research project if you want to be. You do not have to be a part of it if you do not want to be. You should feel free to stop the activity at any point, and your name will not be put on any reports written about this project.</p>
                </div>
                <CIButton className={cls.button} onClick={handleClick}>Okay</CIButton>
            </div>
        </Backdrop>
        <CILogout className={cls.logout} id="logout" onClick={handleLogout} />
        <CIMusic className={cls.music} id="music" />
    </div>
}

export default LandingPage;