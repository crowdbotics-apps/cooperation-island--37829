import { useContext, useEffect, useState } from "react";
import { differenceInYears, endOfMonth, endOfYear, startOfMonth, subYears } from "date-fns";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { AppContext } from "../App";
import BoardImg from "../assets/images/Board.png";
import CIButton from "../shared/CIButton";
import CICheck from "../shared/CICheck";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { toast } from "react-toastify";
import { Howl } from "howler";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    board: {
        position: "absolute",
        top: "3%",
        left: "110%",
        height: "94vh",
        width: "30vw",
        textAlign: "center",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
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
        top: "33.5%",
        left: "-30%",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
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
    },
    button: {
        width: "34% !important",
        marginLeft: "1.8vw"
    },
    gender: {
        "& div": {
            "& label": {
                marginRight: "1.25vw"
            },
            display: "flex",
            alignItems: "center"
        },
        display: "flex",
        justifyContent: "space-evenly",
        width: "86%",
        marginTop: "2.8vh",
        marginBottom: "1.8vh",
        marginLeft: "2.7vw",
    },
    input: {
        marginBottom: "1.8vh",
        marginLeft: "6vw"
    },
    title: {
        fontSize: "4vh",
        fontWeight: "bold",
        letterSpacing: "0.1vw",
        margin: "12vh 0 6vh 1.8vw"
    }
}));

const UserDetails = () => {
    const cls = useStyles();

    const history = useHistory();

    const { user } = useContext(AppContext);

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
                [prop]: event.target.value
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
            toast.error("Your selection is incorrect, as per your age.")
        }
    }

    const handleFocus = (event) => {
        event.target.click();
    }

    return <div>
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_7.png")} />
        <div className={cls.board} id="board">
            <CILabel className={cls.title}>Tell us more about YOU</CILabel>
            <CIInput className={cls.input} placeholder="Nationality" onChange={handleDetails("nationality")} />
            <div className={clsx(cls.gender, "pointer")}>
                <div onClick={handleDetails("male")}>
                    <CILabel className="pointer">Male</CILabel>
                    <CICheck checked={details.gender === 0} />
                </div>
                <div onClick={handleDetails("female")}>
                    <CILabel className="pointer">Female</CILabel>
                    <CICheck checked={details.gender === 1} />
                </div>
            </div>
            <CIInput className={cls.input} placeholder="Zip Code" onChange={handleDetails("zipcode")} />
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
            <CIButton className={cls.button}>Next</CIButton>
        </div>
        <CILogout className={cls.logout} checked id="logout" />
        <CIMusic className={cls.music} id="music" />
    </div>
}

export default UserDetails;