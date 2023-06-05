import { useContext, useEffect, useState } from "react";
import { differenceInYears, endOfMonth, endOfYear, startOfMonth, subYears } from "date-fns";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapUserData, mapUserDetails } from "../funnels/v1";
import { formatNationality, formatZipCode, parseToken, userState, validateZipCode } from "../libs/utils";
import { details as handleDetailsAPI } from "../services/v1";
import { showAvatarPage, showLoginBoard } from "../libs/animations";
import BoardImg from "../assets/images/Board.png";
import CIButton from "../shared/CIButton";
import CICheck from "../shared/CICheck";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
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
    body: {
        height: "76vh",
        width: "26vw",
        marginTop: "8vh",
        marginLeft: "2.5vw",
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
    gender: {
        "& div": {
            "& label": {
                marginRight: "1.25vw"
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },
        display: "flex",
        justifyContent: "space-evenly",
        height: "8vh",
        width: "25.75vw",
        marginTop: "1vh",
        marginBottom: "1.8vh"
    },
    input: {
        marginBottom: "1.8vh"
    },
    title: {
        fontSize: "4vh",
        fontWeight: "bold",
        letterSpacing: "0.1vw",
        margin: "4vh 0 6vh 1.8vw"
    }
}));

const UserDetails = () => {
    const cls = useStyles();

    const history = useHistory();

    const { BGM, howler, user, setUser } = useContext(AppContext);

    const [details, setDetails] = useState({
        nationality: "",
        gender: 0,
        zipcode: "",
        birthDay: null
    });

    useEffect(() => {
        if (user.details)
            history.push("/");
    }, []);


    const handleLogout = () => {
        if (BGM) {
            howler.welcome.fade(howler.welcome.volume(), 0, 1000);
            howler.dashboard?.fade(1, 0, 1000);
        }
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
        if (prop === "male" || prop === "female") {
            new Howl({
                src: require("../assets/sounds/Click.mp3"),
                autoplay: true
            });
            setDetails({
                ...details,
                gender: prop === "male" ? 0 : 1
            });
        }
        else
            setDetails({
                ...details,
                [prop]: prop === "nationality" ? formatNationality(event.target.value, details.nationality) : formatZipCode(event.target.value, details.zipcode)
            });
    }

    const handleBirthday = (value) => {
        if (differenceInYears(startOfMonth(new Date), value) === user.age || differenceInYears(endOfMonth(new Date), value) === user.age)
            setDetails({
                ...details,
                birthDay: value
            });
        else {
            setDetails({ ...details });
            toast.error("The Month or Year is incorrect, based on your age.");
        }
    }

    const handleFocus = (event) => {
        event.target.click();
    }

    const handleNext = () => {
        if (details.nationality.length === 0)
            toast.error("The Nationality cannot be empty.");
        else if (!validateZipCode(details.zipcode))
            toast.error("The Zipcode is invalid.");
        else if (!details.birthDay)
            toast.error("The Birth Date cannot be empty.");
        else {
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
                    toast.error("The Access Code is invalid.")
                });
        }
    }

    return <div>
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_7.png")} />
        <div className={cls.board} id="board">
            <div className={cls.body}>
                <CILabel className={cls.title}>Tell us more about YOU</CILabel>
                <CIInput className={cls.input} placeholder="Nationality" onChange={handleDetails("nationality")} onEnter={handleNext} value={details.nationality} />
                <div className={clsx(cls.gender, "pointer")}>
                    <div className="pointer" onClick={handleDetails("male")}>
                        <CILabel className="pointer">Male</CILabel>
                        <CICheck checked={details.gender === 0} />
                    </div>
                    <div className="pointer" onClick={handleDetails("female")}>
                        <CILabel className="pointer">Female</CILabel>
                        <CICheck checked={details.gender === 1} />
                    </div>
                </div>
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