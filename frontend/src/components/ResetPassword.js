import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showLoginBoard } from "../libs/animations";
import BoardImg from "../assets/images/Board-alt.png";
import CILabel from "../shared/CILabel";
import CIInput from "../shared/CIInput";
import CIButton from "../shared/CIButton";
import anime from "animejs";

const useStyles = makeStyles({
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
        top: "15vh",
        left: "110vw",
        height: "68vh",
        width: "48vw",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "48vw 68vh"
    },
    body: {
        "& input": {
            marginTop: "1vh",
            marginBottom: "3vh",
        },
        "& label:first-child": {
            fontSize: "4.5vh",
            fontWeight: "bold",
            letterSpacing: "0.1vw",
            marginBottom: "6vh"
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "68vh",
        width: "48vw",
        marginTop: "8vh"
    }
});

const ResetPassword = () => {
    const cls = useStyles();

    const history = useHistory();

    const handleSave = () => {
        anime
            .timeline()
            .add({
                targets: "#guide",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#board2",
                left: "110vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=2000")
            .finished.then(() => {
                history.push("/login");
                showLoginBoard();
            });
    }

    return <div>
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_3.png")} />
        <div className={cls.board} id="board2">
            <div className={cls.body}>
                <CILabel>Reset Password</CILabel>
                <CILabel>Username</CILabel>
                <CIInput disabled />
                <CILabel>Password</CILabel>
                <CIInput onEnter={handleSave} type="password" />
                <CIButton onClick={handleSave}>Save</CIButton>
            </div>
        </div>
    </div>
}

export default ResetPassword;