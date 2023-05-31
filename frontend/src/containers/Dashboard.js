import { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { AppContext } from "../App";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles({
    board: {
        width: "20vw"
    },
    guide: {
        position: "absolute",
        top: "33.5%",
        left: "-30%",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
    },
    header: {
        position: "absolute",
        top: "-11.5%",
        left: "64.5%"
    },
    label: {
        position: "absolute",
        fontWeight: "bold",
        textAlign: "center",
        top: "35%",
        width: "20vw"
    },
    logout: {
        position: "absolute",
        top: "15%",
        left: "144%",
        width: "4vw"
    },
    music: {
        position: "absolute",
        top: "17%",
        left: "112%",
        width: "4vw"
    },
    module: {
        position: "absolute",
        top: "26%",
        left: "32%",
        width: "20vw",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)"
    },
    module2: {
        left: "55%"
    },
    module3: {
        left: "78%",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    },
    module4: {
        top: "84%",
        left: "32%",
        display: "none",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    },
    module5: {
        top: "84%",
        left: "55%",
        display: "none",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    },
    module6: {
        top: "84%",
        left: "78%",
        display: "none",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    }
});

const Dashboard = () => {
    const cls = useStyles();

    const history = useHistory();

    const { BGM, howler, user, setHowler } = useContext(AppContext);

    useEffect(() => {
        if (!user.avatar || !user.details)
            history.push("/");

        if (BGM)
            howler.welcome.fade(1, 0.2, 1000);
        setHowler({
            dashboard: new Howl({
                src: [require("../assets/sounds/Dashboard.mp3")],
                autoplay: true,
                volume: BGM ? 1 : 0,
                loop: true
            })
        });
    }, []);

    const handleClick = (event) => {
        new Howl({
            src: require("../assets/sounds/Module.mp3"),
            autoplay: true
        });
        anime({
            targets: event.target,
            scale: [0.9, 1],
            duration: 1000
        });
    }

    return <div>
        <img className={cls.guide} id="guide" src={user.avatar && require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <div className={cls.header} id="header">
            <img className={cls.board} src={require("../assets/images/Name_Plate.png")} />
            <CILabel className={cls.label}>{user.id}</CILabel>
            <CILogout className={cls.logout} checked />
            <CIMusic className={cls.music} id="music" />
        </div>
        <img className={clsx(cls.module, "pointer")} id="module" onClick={handleClick} src={require("../assets/modules/Module_1.png")} />
        <img className={clsx(cls.module, cls.module2, "pointer")} onClick={handleClick} id="module" src={require("../assets/modules/Module_2.png")} />
        <img className={clsx(cls.module, cls.module3)} id="module" src={require(`../assets/modules/Module_${anime.random(1, 2)}.png`)} />
        <img className={clsx(cls.module, cls.module4)} id="module" src={require("../assets/modules/Module_2.png")} />
        <img className={clsx(cls.module, cls.module5)} id="module" src={require("../assets/modules/Module_1.png")} />
        <img className={clsx(cls.module, cls.module6)} id="module" src={require("../assets/modules/Module_2.png")} />
    </div>
}

export default Dashboard;