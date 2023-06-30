import { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showHomePage } from "../libs/animations";
import BoardImg from "../assets/images/Board-alt.png";
import DialogImg from "../assets/modules/Dialog.png";
import Bubbles from "../components/Bubbles";
import Fishes from "../components/Fishes";
import Shell from "../components/Shell";
import CIButton from "../shared/CIButton";
import CIClose from "../shared/CIClose";
import CILabel from "../shared/CILabel";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";
import $ from "jquery";

const useStyles = makeStyles((theme) => ({
    board: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        textAlign: "center",
        top: "5vh",
        left: "38vw",
        height: "90vh",
        width: "55vw",
        transform: "rotateY(-90deg)",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "55vw 90vh"
    },
    dialog: {
        "& button": {
            marginLeft: "13.2vw"
        },
        "& > div": {
            "& button": {
                marginLeft: "6.5vw"
            },
            "& button:last-child": {
                marginLeft: "6vw"
            },
            marginTop: "18vw"
        },
        "& label": {
            "& label": {
                fontSize: "4vh",
                marginTop: "8vh",
                marginLeft: "0vw",
            },
            color: "black",
            fontSize: "6vh",
            textAlign: "center",
            marginTop: "10vh",
            marginBottom: "28vh",
            marginLeft: "5vw",
            width: "25vw"
        },
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)",
        top: "26vh",
        left: "30vw",
        height: "60vh",
        width: "45vw",
        background: `url(${DialogImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "45vw 60vh"
    },
    number: {
        "& label": {
            marginTop: "2vh !important"
        },
        "& span": {
            color: theme.palette.primary.main,
            fontSize: "26vh",
            filter: "drop-shadow(1vh 1.5vh 0.4vh black)",
            marginLeft: "-1vw !important"
        },
        marginTop: "0vh !important"
    },
    logo: {
        position: "absolute",
        filter: "drop-shadow(0.1vh 0.1vh 0.4vh black)",
        top: "-40vh",
        left: "2vw",
        height: "21.83vh",
        width: "28vw"
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
    fish: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scaleX(-1)",
        top: "110vh",
        height: "43.78vh",
        width: "38vw"
    },
    fishId: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        marginLeft: "30vw"
    },
    fishId1: {
        top: "72vh",
        left: "78vw",
        width: "18vw"
    },
    fishId2: {
        top: "43vh",
        left: "82vw",
        width: "15vw"
    },
    fishId3: {
        top: "47vh",
        left: "82vw",
        width: "16vw"
    },
    fishId4: {
        top: "42vh",
        left: "80vw",
        width: "15vw"
    },
    fishId5: {
        top: "60vh",
        left: "79vw",
        width: "15vw"
    },
    fishId6: {
        top: "42vh",
        left: "80vw",
        width: "15vw"
    },
    fishId7: {
        top: "42vh",
        left: "80vw",
        width: "15vw"
    },
    fishId8: {
        top: "44vh",
        left: "80vw",
        width: "15vw"
    },
    fishId9: {
        top: "64vh",
        left: "80vw",
        width: "16vw"
    },
    fishId10: {
        top: "64vh",
        left: "79vw",
        width: "16vw"
    },
    fishId11: {
        top: "65vh",
        left: "79vw",
        width: "16vw"
    },
    fishId12: {
        top: "62vh",
        left: "79vw",
        width: "16vw"
    },
    fishId13: {
        top: "60vh",
        left: "80vw",
        width: "16vw"
    },
    fishId14: {
        top: "50vh",
        left: "79vw",
        width: "17vw"
    },
    fishId15: {
        top: "64vh",
        left: "79vw",
        width: "16vw"
    },
    fishId16: {
        top: "64vh",
        left: "79vw",
        width: "16vw"
    },
    fishId17: {
        top: "65vh",
        left: "79vw",
        width: "17vw"
    },
    fishId18: {
        top: "63vh",
        left: "79vw",
        width: "16vw"
    },
    fishId19: {
        top: "70vh",
        left: "79vw",
        width: "17vw"
    },
    fishId20: {
        top: "66vh",
        left: "79vw",
        width: "16vw"
    },
    fishId21: {
        top: "58vh",
        left: "79vw",
        width: "16vw"
    },
    fishId22: {
        top: "66vh",
        left: "79vw",
        width: "16vw"
    },
    fishId23: {
        top: "71vh",
        left: "79vw",
        width: "17vw"
    },
    fishId24: {
        top: "62vh",
        left: "79vw",
        width: "16vw"
    },
    fishId25: {
        top: "60vh",
        left: "80vw",
        width: "15vw"
    },
    header: {
        fontSize: "4vh",
        marginTop: "10vh"
    },
    close: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "-12vh",
        left: "94vw",
        width: "4vw"
    },
    music: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "-12vh",
        left: "87.5vw",
        width: "4vw"
    },
    shell: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "-12vh",
        left: "81vw",
        width: "4vw"
    },
    shell2: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)",
        zIndex: 1,
        top: "37vh",
        left: "40vw"
    },
    body: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            marginTop: "4vh"
        },
        "& label": {
            color: "black",
            marginTop: "12vh"
        },
        "& img": {
            width: "5vw",
            marginTop: "10vh",
            marginBottom: "-8vh"
        },
        marginTop: "12vh",
        padding: "0vh 8vw"
    }
}));

const Module_1 = () => {
    const cls = useStyles();

    const history = useHistory();

    const [showBGAnimations, setAnimation] = useState(false);

    const [fishArray] = useState(Array(25).fill().map((_, i) => i + 1).sort(() => Math.random() - 0.5));

    const [fishID, setFish] = useState(0);

    const [show, setShow] = useState(false);

    const [response, setResponse] = useState(true);

    const [number, setNumber] = useState(0);

    const [trial, setTrial] = useState(1);

    const { BGM, howler, user } = useContext(AppContext);

    useEffect(() => {
        anime
            .timeline()
            .add({
                targets: "#background",
                opacity: 0,
                easing: "linear",
                duration: 2000,
                complete: () => {
                    $("#background").attr("src", require("../assets/modules/Module_1_BG.jpg"));
                }
            })
            .add({
                targets: "#background",
                opacity: 1,
                easing: "linear",
                changeBegin: () => setAnimation(true),
                duration: 2000
            })
            .add({
                targets: "#logo2",
                top: "6vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=1000")
            .add({
                targets: "#fish",
                top: "50vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#board",
                rotateY: ["-90deg", "0deg"],
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
    }, []);

    const handleClick = () => {
        anime
            .timeline()
            .add({
                targets: "#fish",
                left: "-40vw",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#board",
                rotateY: ["0deg", "90deg"],
                easing: "linear",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#guide",
                left: "3vw",
                easing: "easeOutQuint",
                duration: 2000
            })
            .add({
                targets: "#dialog",
                scale: [0, 1],
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#fish2",
                marginLeft: "0vw",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#close, #music, #shell",
                top: "4vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000");
    }

    const handleClose = () => {
        anime
            .timeline()
            .add({
                targets: "#background, #bg-animations",
                opacity: 0,
                easing: "linear",
                duration: 2000,
                complete: () => {
                    $("#background").attr("src", require("../assets/images/Application_BG.jpg"));
                }
            })
            .add({
                targets: "#background",
                opacity: 1,
                easing: "linear",
                duration: 2000
            })
            .add({
                targets: "#logo2",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#guide",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#dialog",
                scale: [1, 0],
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#fish2",
                marginLeft: "30vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#close, #music, #shell",
                top: "-12vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .finished.then(() => {
                howler.module_1.fade(howler.module_1.volume(), 0, 1000);
                if (BGM)
                    howler.welcome.fade(0, 1, 1000);

                history.push("/home");
                anime({
                    targets: "#logo",
                    top: "-12vh",
                    left: "-12vw",
                    scale: 0.45,
                    translateX: ["-30vw", "0vw"],
                    translateY: ["-30vh", "0vh"],
                    easing: "easeOutQuint",
                    duration: 2000
                });
                showHomePage();
            });
    }

    const handleShow = () => {
        new Howl({
            src: require("../assets/sounds/Number.mp3"),
            autoplay: true
        });
        setShow(true);
        setNumber(anime.random(1, 6));
    }

    const handleRestart = (flag) => () => {
        setResponse(false);

        new Howl({
            src: require(`../assets/sounds/${flag ? "Shell" : "No_Shell"}.mp3`),
            autoplay: true
        });

        anime({
            targets: flag ? "#shell2Alt" : "#shell2",
            scale: [
                {
                    value: 1.4,
                    easing: "easeOutElastic",
                    duration: 1000,
                },
                {
                    value: flag ? 0.16 : 0,
                    easing: "easeOutExpo",
                    delay: 200,
                    duration: 800
                }
            ],
            left: flag && {
                value: "76.02vw",
                delay: 1200,
                duration: 800
            },
            top: flag && {
                value: "-7.55vh",
                delay: 1200,
                duration: 800
            },
            easing: "linear",
            complete: () => {
                if (flag) {
                    anime({
                        targets: "#shell2Alt",
                        scale: 0,
                        top: "37vh",
                        left: "40vw",
                        duration: 1
                    });
                    anime({
                        targets: "#shell",
                        scale: [0.9, 1],
                        duration: 1000
                    });
                }
            },
        });

        if (trial === 103) {
            new Howl({
                src: require("../assets/sounds/Activity.mp3"),
                autoplay: true,
                onplay: () => {
                    if (howler.module_1.volume())
                        howler.module_1.fade(howler.module_1.volume(), 0.1, 1000);
                },
                onend: () => {
                    if (howler.module_1.volume())
                        howler.module_1.fade(0.1, 1, 1000);
                }
            });
        }
        else {
            anime({
                targets: "#fish2",
                scale: [1, 0],
                easing: "easeOutQuint",
                duration: 2000
            })
                .finished.then(() => {
                    setFish(fishID + 1);
                    setTrial(trial + 1);
                    setResponse(true);
                    setShow(false);
                    setNumber(0);
                    anime({
                        targets: "#fish2",
                        scale: [0, 1],
                        marginLeft: "0vw",
                        easing: "easeOutQuint",
                        duration: 2000
                    });
                });
        }
    }

    return <div>
        {showBGAnimations && <div id="bg-animations">
            <Fishes />
            <Bubbles />
        </div>}
        <img className={cls.logo} id="logo2" src={require("../assets/modules/Module_1_Text.png")} />
        <img className={cls.fish} id="fish" src={require("../assets/fishes/Fish_1.png")} />
        <img className={cls.guide} id="guide" src={require(`../assets/avatars/aqua/Avatar_${user.avatar}.png`)} />
        <img className={clsx(cls.fishId, cls["fishId" + fishArray[fishID]])} id="fish2" src={require(`../assets/fishes/Fish_${fishArray[fishID]}.png`)} />
        <CIClose className={cls.close} id="close" onClick={handleClose} />
        <CIMusic className={cls.music} id="music" />
        <CIShell className={cls.shell} id="shell" />
        <Shell className={cls.shell2} id="shell2" />
        <Shell alt className={cls.shell2} id="shell2Alt" />
        <div className={cls.dialog} id="dialog">
            {show ? <Fragment>
                <CILabel className={cls.number}>
                    <span>
                        {number}
                    </span>
                    <CILabel>
                        Did you guess right?
                    </CILabel>
                </CILabel>
                {response && <div>
                    <CIButton alt onClick={handleRestart(true)}>Yes</CIButton>
                    <CIButton onClick={handleRestart(false)}>No</CIButton>
                </div>}
            </Fragment> : <Fragment>
                <CILabel>
                    I’m thinking of a number between 1-6.
                    <CILabel>
                        What number am I thinking?
                    </CILabel>
                </CILabel>
                <CIButton onClick={handleShow}>Show</CIButton>
            </Fragment>}
        </div>
        <div className={cls.board} id="board">
            <CILabel className={cls.header}>
                Welcome to the Fish Mind Reading activity!
            </CILabel>
            <div className={cls.body}>
                <CILabel>
                    In this activity, fishes like me will think of a number between 1-6 and you will try to guess that number.
                </CILabel>
                <CILabel>
                    If you guess the number correctly, then you’ll get a shell, otherwise no shell.
                </CILabel>
                <img src={require("../assets/modules/Shell-alt.png")} />
                <CILabel>
                    Are you ready?
                </CILabel>
                <CIButton onClick={handleClick}>Let's GO</CIButton>
            </div>
        </div>
    </div>
}

export default Module_1;