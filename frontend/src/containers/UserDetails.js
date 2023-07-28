import { useContext, useEffect, useState } from "react";
import { endOfYear, subYears } from "date-fns";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapUserData, mapUserDetails } from "../funnels/v1";
import { formatText, formatZipCode, parseToken, userState } from "../libs/utils";
import { details as handleDetailsAPI } from "../services/v1";
import { showAvatarPage, showLoginBoard } from "../libs/animations";
import BoardImg from "../assets/images/Board-alt.png";
import CIButton from "../shared/CIButton";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    board: {
        position: "absolute",
        top: "3vh",
        left: "110vw",
        height: "94vh",
        width: "56vw",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "56vw 94vh"
    },
    body: {
        "& label": {
            "&:first-child": {
                fontSize: "4vh",
                fontWeight: "bold",
                letterSpacing: "0.1vw",
                margin: "4vh 0 3vh 1.8vw"
            },
            fontSize: "2.5vh",
            letterSpacing: "0.05vw",
            marginBottom: "3vh"
        },
        height: "80vh",
        width: "46vw",
        marginTop: "8vh",
        marginLeft: "5vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    },
    dialog: {
        "& div:has(button)": {
            display: "none"
        },
        "& div": {
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
            color: theme.palette.primary.main,
            cursor: "inherit",
            fontFamily: "Summer Show",
            fontSize: "4vh"
        }
    },
    guide: {
        position: "absolute",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
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
    },
    button: {
        marginTop: "2vh"
    },
    input: {
        marginBottom: "1.8vh"
    }
}));

const UserDetails = () => {
    const cls = useStyles();

    const history = useHistory();

    const { BGM, howler, user, setUser } = useContext(AppContext);

    const [details, setDetails] = useState({
        nationality: "",
        gender: "",
        zipcode: "",
        birthDay: null
    });

    useEffect(() => {
        if (user.details)
            history.push("/");
    }, []);


    const handleLogout = () => {
        if (BGM)
            howler.welcome.fade(howler.welcome.volume(), 0, 1000);
        localStorage.clear();

        anime({
            targets: "#board, #guide, #logout, #music",
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

    const handleDetails = (prop) => (event) => {
        if (prop === "zipcode")
            setDetails({
                ...details,
                [prop]: formatZipCode(event.target.value, details.zipcode)
            });
        else
            setDetails({
                ...details,
                [prop]: formatText(event.target.value, details[prop])
            });
    }

    const handleBirthday = (value) => {
        setDetails({
            ...details,
            birthDay: value
        });
    }

    const handleFocus = (event) => {
        event.target.click();
    }

    const handleNext = () => {
        handleDetailsAPI(mapUserDetails(details))
            .then(({ data }) => {
                const userData = parseToken(data.user);

                if (userData) {
                    localStorage["UserState"] = data.user;
                }

                anime({
                    targets: "#logo",
                    left: "-50vw",
                    easing: "easeInQuint",
                    duration: 2000
                });
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
                anime({
                    targets: "#logout, #music",
                    left: "100vw",
                    easing: "easeInQuint",
                    duration: 2000
                })
                    .finished.then(() => {
                        setUser(mapUserData((userData)));

                        history.push("/avatar");
                        showAvatarPage();
                    });
            })
            .catch(() => {
                toast.error("Something went wrong.");
            });
    }

    return <div>
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_7.png")} />
        <div className={cls.board} id="board">
            <div className={cls.body}>
                <CILabel>Tell us more about YOU</CILabel>
                <CILabel>If you don't know the answers to these questions, please ask a parent if possible.</CILabel>
                <CIInput className={cls.input} placeholder="Nationality" onChange={handleDetails("nationality")} onEnter={handleNext} value={details.nationality} />
                <CIInput className={cls.input} placeholder="Gender" onChange={handleDetails("gender")} onEnter={handleNext} value={details.gender} />
                <CIInput className={cls.input} placeholder="Zip Code" onChange={handleDetails("zipcode")} onEnter={handleNext} value={details.zipcode} />
                <DatePicker
                    autoOk
                    disableToolbar
                    className={clsx(cls.input, "pointer")}
                    maxDate={endOfYear(new Date)}
                    minDate={subYears(new Date, 19)}
                    format="MMM yyyy"
                    views={["month", "year"]}
                    onFocus={handleFocus}
                    onChange={handleBirthday}
                    placeholder="Birthday"
                    value={details.birthDay}
                    DialogProps={{
                        PaperProps: {
                            className: clsx(cls.dialog, "pointer"),
                        }
                    }}
                    TextFieldComponent={(params) => <CIInput {...params} onChange={handleBirthday} />}
                />
                <CIButton className={cls.button} onClick={handleNext}>Next</CIButton>
            </div>
        </div>
        <CILogout className={cls.logout} id="logout" onClick={handleLogout} />
        <CIMusic className={cls.music} id="music" />
    </div>
}

export default UserDetails;