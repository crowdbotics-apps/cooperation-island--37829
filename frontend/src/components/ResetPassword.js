import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showLoginBoard } from "../libs/animations";
import CILabel from "../shared/CILabel";
import CIInput from "../shared/CIInput";
import CIButton from "../shared/CIButton";
import anime from "animejs";

const useStyles = makeStyles({
    guide: {
        position: "absolute",
        top: "33.5%",
        left: "-30%",
        height: "88vh",
        width: "20vw"
    },
    board: {
        position: "absolute",
        top: "-1%",
        left: "110%",
        height: "100vh",
        width: "30vw",
        rotate: "90deg",
        background: "url('/images/Board.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
    },
    body: {
        "& button": {
            width: "36%"
        },
        "& input": {
            marginTop: "1vh",
            marginBottom: "1vh",
            marginLeft: "5.25vw"
        },
        "& label": {
            "&:first-child": {
                fontSize: "4.5vh",
                fontWeight: "bold",
                letterSpacing: "0.1vw",
                marginBottom: "4vh"
            },
            width: "100%"
        },
        rotate: "-90deg",
        height: "61vh",
        width: "100%",
        marginTop: "30%",
        marginLeft: "9%",
        textAlign: "center"
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
                left: "-30%",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#board2",
                left: "110%",
                easing: "easeInQuint",
                duration: 2000
            }, "-=2000")
            .finished.then(() => {
                history.push("/login");
                showLoginBoard();
            });
    }

    return <div>
        <img className={cls.guide} id="guide" src="/avatars/Avatar_3.png" />
        <div className={cls.board} id="board2">
            <div className={cls.body}>
                <CILabel>Reset Password</CILabel>
                <CILabel>Email</CILabel>
                <CIInput disabled />
                <CILabel>Password</CILabel>
                <CIInput type="password" />
                <CIButton onClick={handleSave}>Save</CIButton>
            </div>
        </div>
    </div>
}

export default ResetPassword;