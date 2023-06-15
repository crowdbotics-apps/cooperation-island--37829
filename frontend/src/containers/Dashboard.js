import { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { userState } from "../libs/utils";
import { showLoginBoard } from "../libs/animations";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { AppContext } from "../App";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles({
    board: {
        height: "11.9vh",
        width: "20vw"
    },
    guide: {
        position: "absolute",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
    },
    header: {
        position: "absolute",
        top: "-11.5vh",
        left: "64.5vw"
    },
    label: {
        position: "absolute",
        fontWeight: "bold",
        textAlign: "center",
        top: "4.5vh",
        width: "20vw"
    },
    logout: {
        position: "absolute",
        top: "0vh",
        left: "29vw",
        width: "4vw"
    },
    music: {
        position: "absolute",
        top: "0vh",
        left: "22.6vw",
        width: "4vw"
    },
    module: {
        position: "absolute",
        top: "26vh",
        left: "32vw",
        height: "50.3vh",
        width: "20vw",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)"
    },
    module2: {
        left: "55vw"
    },
    module3: {
        left: "78vw",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    },
    module4: {
        top: "84vh",
        left: "32vw",
        display: "none",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    },
    module5: {
        top: "84vh",
        left: "55vw",
        display: "none",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    },
    module6: {
        top: "84vh",
        left: "78vw",
        display: "none",
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black) grayscale(1)"
    }
});

const Dashboard = () => {
    const cls = useStyles();

    const history = useHistory();

    const { BGM, howler, user, setHowler, setUser } = useContext(AppContext);

    useEffect(() => {
        if (!user.avatar || !user.details)
            history.push("/");

        if (BGM)
            howler.welcome.fade(howler.welcome.volume(), 0.2, 1000);
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
        })
            .finished.then(() => {
                anime({
                    targets: "#background",
                    width: "100vw",
                    height: "100vh",
                    marginTop: "0vh",
                    marginLeft: "0vw",
                    opacity: 1,
                    easing: "easeInQuint",
                    duration: 2000
                });
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
                    targets: "#header",
                    top: "-11.5vh",
                    easing: "easeInQuint",
                    duration: 2000
                });
                anime({
                    targets: "#module",
                    scale: 0,
                    easing: "easeInQuint",
                    duration: 2000
                });
            });
    }

    const handleLogout = () => {
        if (BGM) {
            howler.welcome.fade(howler.welcome.volume(), 0, 1000);
            howler.dashboard?.fade(1, 0, 1000);
        }
        localStorage.clear();

        anime({
            targets: "#background",
            width: "100vw",
            height: "100vh",
            marginTop: "0vh",
            marginLeft: "0vw",
            opacity: 0.2,
            easing: "easeOutQuint",
            delay: 1000,
            duration: 1000
        });
        anime({
            targets: "#guide, #header, #module",
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

    return <div>
        <img className={cls.guide} id="guide" src={user.avatar && require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <div className={cls.header} id="header">
            <img className={cls.board} src={require("../assets/images/Name_Plate.png")} />
            <CILabel className={cls.label}>{user.id}</CILabel>
            <CILogout className={cls.logout} id="logout" onClick={handleLogout} />
            <CIMusic className={cls.music} id="music" />
        </div>
        <img className={clsx(cls.module, "pointer")} id="module" onClick={handleClick} src={require("../assets/modules/Module_1.png")} />
        <img className={clsx(cls.module, cls.module2, "pointer")} id="module" onClick={handleClick} src={require("../assets/modules/Module_2.png")} />
        <img className={clsx(cls.module, cls.module3)} id="module" src={require(`../assets/modules/Module_${anime.random(1, 2)}.png`)} />
        <img className={clsx(cls.module, cls.module4)} id="module" src={require("../assets/modules/Module_2.png")} />
        <img className={clsx(cls.module, cls.module5)} id="module" src={require("../assets/modules/Module_1.png")} />
        <img className={clsx(cls.module, cls.module6)} id="module" src={require("../assets/modules/Module_2.png")} />
    </div>
}

export default Dashboard;