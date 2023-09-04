import { useEffect, useRef, useState } from "react";
import { Backdrop, makeStyles } from "@material-ui/core";
import BoardImg from "../assets/images/Board-sm.png";
import CILabel from "../shared/CILabel";
import anime from "animejs";

const useStyles = makeStyles({
    backdrop: {
        zIndex: 6
    },
    board: {
        "& label": {
            "&:last-child": {
                color: "black",
                fontSize: "14vh",
                marginTop: "4vh"
            },
            fontSize: "5vh",
            marginTop: "9vh",
            padding: "0vh 4vw"
        },
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        textAlign: "center",
        top: "32vh",
        left: "32vw",
        height: "36vh",
        width: "36vw",
        transform: "scale(0)",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "36vw 36vh"
    },
});

const IdlePrompt = (props) => {
    const cls = useStyles();

    const backdropRef = useRef(false);

    const propsRef = useRef();

    const timerRef = useRef();

    const [showBackdrop, hideBackdrop] = useState(false);

    const [timeLeft, setTimeleft] = useState(false);

    useEffect(() => {
        const idleTimer = setInterval(() => {
            const now = parseInt(new Date().getTime() / 1000);

            if (parseInt(now - localStorage.LastActivity) === 299) {
                const timer = setInterval(() => {
                    const timeLeft = 61 - parseInt(new Date().getTime() / 1000 - now);

                    if (timeLeft > 0)
                        handleOpen(timeLeft);
                    else
                        handleClose(true);
                }, 1000);

                timerRef.current = timer;
            }
        }, 1000);

        localStorage.LastActivity = parseInt(new Date().getTime() / 1000);

        ["click", "keypress", "load", "mousemove"].forEach(x => {
            window.addEventListener(x, handleActivity);
        });

        return () => {
            clearInterval(idleTimer);
            localStorage.removeItem("LastActivity");

            ["click", "keypress", "load", "mousemove"].forEach(x => {
                window.removeEventListener(x, handleActivity);
            });
        }
    }, []);

    useEffect(() => {
        propsRef.current = props.handleClose;
    }, [props.handleClose]);

    const handleActivity = () => {
        localStorage.LastActivity = parseInt(new Date().getTime() / 1000);
        handleClose();
    }

    const handleClose = (isIdle) => {
        clearInterval(timerRef.current);
        isIdle && setTimeleft(0);

        anime({
            targets: "#board8",
            scale: 0,
            easing: "easeInQuint",
            duration: 200,
            complete: () => {
                backdropRef.current = false;
                hideBackdrop(false);
                isIdle && propsRef.current();
            }
        });
    }

    const handleOpen = (timeLeft) => {
        if (backdropRef.current)
            setTimeleft(timeLeft);
        else
            anime({
                targets: "#board8",
                scale: [0, 1],
                duration: 1000,
                begin: () => {
                    setTimeleft(timeLeft);
                    hideBackdrop(true);
                    backdropRef.current = true;
                }
            });
    }

    return <Backdrop className={cls.backdrop} open={showBackdrop}>
        <div className={cls.board} id="board8">
            <CILabel>
                Your session will expire in
            </CILabel>
            <CILabel>
                {`00:${timeLeft < 10 ? "0" : ""}${timeLeft}`}
            </CILabel>
        </div>
    </Backdrop>
}

export default IdlePrompt;