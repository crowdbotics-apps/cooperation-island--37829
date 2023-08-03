import { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapFeedback } from "../funnels/v1";
import { userState } from "../libs/utils";
import { feedback } from "../services/v1";
import { showAvatarPage, showLoginBoard } from "../libs/animations";
import CIAvatar from "../shared/CIAvatar";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles({
    board: {
        filter: "drop-shadow(0.33vh 0.66vh 0.8vh black)",
        height: "11.9vh",
        width: "20vw"
    },
    guide: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw",
        transform: "scaleX(-1)"
    },
    header: {
        position: "absolute",
        top: "-11.5vh",
        left: "51.5vw"
    },
    label: {
        position: "absolute",
        fontWeight: "bold",
        textAlign: "center",
        top: "4.5vh",
        width: "20vw"
    },
    shell: {
        position: "absolute",
        top: "0vh",
        left: "22.6vw",
        width: "4vw"
    },
    avatar: {
        position: "absolute",
        top: "0vh",
        left: "29vw",
        width: "4vw"
    },
    music: {
        position: "absolute",
        top: "0vh",
        left: "35.4vw",
        width: "4vw"
    },
    logout: {
        position: "absolute",
        top: "0vh",
        left: "42vw",
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
        left: "78vw"
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

    const { avatarRef, BGM, howler, user, setFeedback, setHowler, setUser } = useContext(AppContext);

    useEffect(() => {
        if (!user.avatar || !user.details)
            history.push("/");
    }, []);

    const handleAvatar = () => {
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
            duration: 2000,
            complete: () => {
                history.push("/avatar");
                showAvatarPage(avatarRef.current.setUser);
            }
        });
    }

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
                    duration: 2000,
                    complete: () => {
                        switch (parseInt(event.target.getAttribute("module"))) {
                            case 1:
                                howler.welcome.fade(howler.welcome.volume(), 0, 1000);
                                setHowler({
                                    module_1: new Howl({
                                        src: [require("../assets/sounds/Module_1.mp3")],
                                        autoplay: true,
                                        volume: BGM ? 1 : 0,
                                        loop: true
                                    })
                                });

                                feedback("fish-mind-reading")
                                    .then(({ data }) => {
                                        setFeedback(mapFeedback(data));
                                    });

                                history.push("/fish-mind-reading", {
                                    module: 1
                                });

                                break;
                            case 2:
                                howler.welcome.fade(howler.welcome.volume(), 0, 1000);
                                setHowler({
                                    module_2: new Howl({
                                        src: [require("../assets/sounds/Module_2.mp3")],
                                        autoplay: true,
                                        volume: BGM ? 1 : 0,
                                        loop: true
                                    })
                                });

                                feedback("tree-shaking")
                                    .then(({ data }) => {
                                        setFeedback(mapFeedback(data));
                                    });

                                history.push("/tree-shaking", {
                                    module: 2
                                });

                                break;
                            case 3:
                                howler.welcome.fade(howler.welcome.volume(), 0, 1000);
                                setHowler({
                                    module_3: new Howl({
                                        src: [require("../assets/sounds/Module_3.mp3")],
                                        autoplay: true,
                                        volume: BGM ? 1 : 0,
                                        loop: true
                                    })
                                });

                                feedback("tell-us-about-you")
                                    .then(({ data }) => {
                                        setFeedback(mapFeedback(data));
                                    });

                                history.push("/voice-your-values", {
                                    module: 3
                                });

                                break;
                        }
                    }
                });
            });
    }

    const handleLogout = () => {
        if (BGM)
            howler.welcome.fade(howler.welcome.volume(), 0, 1000);
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
            <CIShell className={cls.shell} id="shell" />
            <CIAvatar className={cls.avatar} id="avatar" onClick={handleAvatar} />
            <CIMusic className={cls.music} id="music" />
            <CILogout className={cls.logout} id="logout" onClick={handleLogout} />
        </div>
        <img className={clsx(cls.module, "pointer")} id="module" module={1} onClick={handleClick} src={require("../assets/modules/Module_1.png")} />
        <img className={clsx(cls.module, cls.module2, "pointer")} id="module" module={2} onClick={handleClick} src={require("../assets/modules/Module_2.png")} />
        <img className={clsx(cls.module, cls.module3, "pointer")} id="module" module={3} onClick={handleClick} src={require("../assets/modules/Module_3.png")} />
        <img className={clsx(cls.module, cls.module4)} id="module" src={require("../assets/modules/Module_1.png")} />
        <img className={clsx(cls.module, cls.module5)} id="module" src={require("../assets/modules/Module_2.png")} />
        <img className={clsx(cls.module, cls.module6)} id="module" src={require("../assets/modules/Module_3.png")} />
    </div>
}

export default Dashboard;