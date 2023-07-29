import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { privacy, terms } from "../services/v1";
import { showLoginBoard } from "../libs/animations";
import ReactHtmlParser from "react-html-parser";
import BoardImg from "../assets/images/Board-lg.png";
import CILabel from "../shared/CILabel";
import CIButton from "../shared/CIButton";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    guide: {
        position: "absolute",
        top: "33.5vh",
        left: "-30vw",
        height: "88vh",
        width: "30vw",
        transform: "scaleX(-1)"
    },
    board: {
        position: "absolute",
        top: "1.5vh",
        left: "110vw",
        height: "94vh",
        width: "54vw",
        textAlign: "center",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "54vw 94vh"
    },
    title: {
        fontSize: "4.5vh",
        fontWeight: "bold",
        letterSpacing: "0.1vw",
        marginTop: "10vh",
        marginBottom: "4vh"
    },
    body: {
        "&::-webkit-scrollbar": {
            width: "0.5vw"
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.primary.main,
            borderRadius: "1vw"
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent"
        },
        fontSize: "2.6vh",
        textAlign: "left",
        margin: "2vh 5vw 1vh 7vw",
        height: "62.3vh",
        overflowY: "scroll"
    },
    button: {
        marginTop: "2vh",
        marginLeft: "2vw"
    }
}));

const ReadingPane = () => {
    const cls = useStyles();

    const history = useHistory();

    const [body, setBody] = useState("");

    const pageType = window.location.pathname.includes("/privacy") ? 0 : 1;

    useEffect(() => {
        Promise.all([pageType ? terms() : privacy()])
            .then(([{ data }]) => {
                setBody(ReactHtmlParser(data.body));
            });
    }, []);

    const handleClose = () => {
        anime
            .timeline()
            .add({
                targets: "#guide",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#board3",
                left: "110vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=2000")
            .finished.then(() => {
                history.push("/signup");
                showLoginBoard();
            });
    }

    return <div>
        <img className={cls.guide} id="guide" src={require(`../assets/avatars/Avatar_${pageType ? 4 : 5}.png`)} />
        <div className={cls.board} id="board3">
            <CILabel className={cls.title}>
                {pageType ? "Terms & Conditions" : "Privacy Policy"}
            </CILabel>
            <div className={clsx(cls.body, "typer")}>
                {body}
            </div>
            <CIButton className={cls.button} onClick={handleClose}>Close</CIButton>
        </div>
    </div>
}

export default ReadingPane;