import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { anime } from "../libs/utils";
import { showLoginBoard } from "../libs/animations";
import { getUsername, savePassword } from "../services/v1";
import BoardImg from "../assets/images/Board.png";
import CILabel from "../shared/CILabel";
import CIInput from "../shared/CIInput";
import CIButton from "../shared/CIButton";
import { toast } from "react-toastify";

const useStyles = makeStyles({
    guide: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "35.25vh",
        left: "-30vw",
        height: "66.2vh",
        width: "22vw",
        transform: "scaleX(-1)"
    },
    board: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
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

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const sessionId = window.location.pathname.split("/").pop();

    useEffect(() => {
        getUsername(sessionId)
            .then(({ data }) => {
                setUsername(data.username);
            })
            .catch(() => {
                toast.error("The Session ID is invalid or expired.");
                history.push("/login");
            });
    }, []);

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSave = () => {
        if (password.trim().length < 8)
            toast.error("Password must be at least 8 characters.");
        else {
            savePassword(sessionId, password)
                .then(() => {
                    toast.success("Your Password has been updated.");
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
                })
                .catch(() => {
                    toast.error("Something went wrong.");
                });
        }
    }

    return <div>
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_3.png")} />
        <div className={cls.board} id="board2">
            <div className={cls.body}>
                <CILabel>Reset Password</CILabel>
                <CILabel>Username</CILabel>
                <CIInput disabled value={username} />
                <CILabel>Password</CILabel>
                <CIInput onChange={handlePassword} onEnter={handleSave} type="password" value={password} />
                <CIButton onClick={handleSave}>Save</CIButton>
            </div>
        </div>
    </div>
}

export default ResetPassword;