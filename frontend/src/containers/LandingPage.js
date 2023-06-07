import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { mapUserData } from "../funnels/v1";
import { formatCode, parseToken, userState } from "../libs/utils";
import { access as handleAccess, refresh as handleRefresh } from "../services/v1";
import { showDetailsPage, showLoginBoard } from "../libs/animations";
import BoardImg from "../assets/images/Board-alt.png";
import CIButton from "../shared/CIButton";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
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
    guide: {
        position: "absolute",
        top: "38vh",
        left: "71vw",
        height: "58vh",
        width: "20vw",
        transform: "scale(0)"
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
    body: {
        "& input": {
            marginTop: "1vh",
            marginBottom: "6vh"
        },
        "& label:first-child": {
            fontSize: "2.5vh",
            letterSpacing: "0.1vw",
            paddingTop: "2vh",
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

    const { BGM, howler, setUser } = useContext(AppContext);

    const [text, setText] = useState("");

    useEffect(() => {
        window.RefreshTimer = setInterval(() => {
            if (localStorage["AccessToken"])
                handleRefresh()
                    .then(handleSave);
            else
                clearInterval(window.RefreshTimer);
        }, 1000);
    }, []);

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

    const handleSave = ({ data }) => {
        const userData = parseToken(data.user);

        if (userData && userData.consent_status) {
            clearInterval(window.RefreshTimer);
            localStorage["UserState"] = data.user;

            anime({
                targets: "#board4",
                top: "110vh",
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
        <div className={cls.board} id="board4">
            <div className={cls.body}>
                <CILabel>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.</CILabel>
                <CILabel>Access Code</CILabel>
                <CIInput onChange={handleChange} onEnter={handleSubmit} value={text} />
                <CIButton onClick={handleSubmit}>Submit</CIButton>
            </div>
        </div>
        <CILogout className={cls.logout} id="logout" onClick={handleLogout} />
        <CIMusic className={cls.music} id="music" />
    </div>
}

export default LandingPage;