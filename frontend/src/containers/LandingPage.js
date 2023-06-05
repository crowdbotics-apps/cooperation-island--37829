import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { mapUserData } from "../funnels/v1";
import { formatCode, parseToken, userState } from "../libs/utils";
import { access as handleAccess, refresh as handleRefresh } from "../services/v1";
import { showDetailsPage, showLoginBoard } from "../libs/animations";
import BoardImg from "../assets/images/Board.png";
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
        top: "38%",
        left: "48%",
        height: "41vh",
        width: "11vw",
        transform: "scale(0)"
    },
    guide: {
        position: "absolute",
        top: "38%",
        left: "71%",
        height: "58vh",
        width: "20vw",
        transform: "scale(0)"
    },
    board: {
        position: "absolute",
        top: "76%",
        left: "52%",
        height: "110vh",
        width: "30vw",
        rotate: "90deg",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
    },
    body: {
        "& button": {
            width: "26%"
        },
        "& input": {
            marginTop: "1vh",
            marginBottom: "3vh",
            marginLeft: "9vw"
        },
        "& label": {
            "&:first-child": {
                fontSize: "2.5vh",
                letterSpacing: "0.1vw",
                paddingTop: "3vh",
                marginBottom: "14vh"
            },
            width: "100%"
        },
        rotate: "-90deg",
        height: "48vh",
        width: "126%",
        marginTop: "47%",
        marginLeft: "-12%",
        textAlign: "center"
    },
    logout: {
        position: "absolute",
        top: "4%",
        left: "100%",
        width: "4vw"
    },
    music: {
        position: "absolute",
        top: "17%",
        left: "100%",
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
                    .then(handleMove);
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

    const handleMove = ({ data }) => {
        const userData = parseToken(data.user);

        if (userData && userData.consent_status) {
            clearInterval(window.RefreshTimer);
            localStorage["UserState"] = data.user;

            anime({
                targets: "#board4",
                top: "76%",
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#logout, #music",
                left: "100%",
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#guide, #animal",
                top: "38%",
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
                .then(handleMove)
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