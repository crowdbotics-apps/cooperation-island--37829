import { useContext, useEffect, useRef, useState } from "react";
import { Backdrop, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { shuffleArray } from "../libs/utils";
import { score } from "../services/v1";
import { showHomePage } from "../libs/animations";
import BoardImg from "../assets/images/Board.png";
import BoardSmImg from "../assets/images/Board-sm.png";
import SpeechImg from "../assets/modules/Speech.png";
import BirdsClouds from "../components/BirdsClouds";
import Feedback from "../components/Feedback";
import IdlePrompt from "../components/IdlePrompt";
import Shell from "../components/Shell";
import CIButton from "../shared/CIButton";
import CIClose from "../shared/CIClose";
import CILabel from "../shared/CILabel";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
import { useTimer } from "react-use-precision-timer";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";
import $ from "jquery";

const useStyles = makeStyles({
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
    board2: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            margin: "24vh 2vw 0vh",
        },
        "& label": {
            fontSize: "3.5vh",
            marginTop: "13.5vh",
            padding: "0vh 7vw"
        },
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        textAlign: "center",
        top: "23vh",
        left: "25vw",
        height: "54vh",
        width: "50vw",
        transform: "scale(0)",
        background: `url(${BoardSmImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "50vw 54vh"
    },
    backdrop: {
        zIndex: 5
    },
    logo: {
        position: "absolute",
        filter: "drop-shadow(0.1vh 0.1vh 0.4vh black)",
        top: "-40vh",
        left: "1.5vw",
        height: "22.95vh",
        width: "21vw"
    },
    palmAlt: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)",
        top: "40vh",
        left: "15vw",
        height: "120.52vh",
        width: "68vw"
    },
    palmWrapper: {
        position: "absolute",
        overflow: "hidden",
        top: "-9vh",
        left: "15vw",
        height: "120.52vh",
        width: "68vw"
    },
    palm: {
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "translateX(0vw)",
        height: "120.52vh",
        width: "2720vw"
    },
    instructor: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scaleX(-1)",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw"
    },
    guide: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scaleX(-1)",
        top: "33.5vh",
        left: "-30vw",
        height: "70vh",
        width: "24vw"
    },
    guide2: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "33.5vh",
        left: "108vw",
        height: "70vh",
        width: "24vw"
    },
    header: {
        fontSize: "4vh",
        marginTop: "10vh",
        marginBottom: "-4vh"
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
        transform: "rotateY(-90deg)",
        top: "78vh",
        left: "20vw",
        width: "8vw",
    },
    shell2Alt: {
        left: "73vw"
    },
    label: {
        position: "absolute",
        fontSize: "9vh",
        textAlign: "center",
        transform: "rotateY(-90deg)",
        top: "82vh",
        left: "20vw",
        width: "8vw"
    },
    labelAlt: {
        left: "73vw"
    },
    speech: {
        "& > div": {
            "& button": {
                marginTop: "4vh",
                marginLeft: "7vw"
            },
            "& button:last-child": {
                marginLeft: "3.75vw"
            },
            marginTop: "6vh"
        },
        "& label": {
            fontSize: "4.2vh",
            textAlign: "center",
            marginTop: "12vh",
            marginLeft: "3.5vw",
            width: "26vw"
        },
        "& label:nth-child(2)": {
            marginTop: "2vh",
            width: "28vw"
        },
        "& label:nth-child(3)": {
            fontSize: "3.2vh",
            marginTop: "8vh",
            marginLeft: "7vw",
            width: "20vw"
        },
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)",
        top: "20vh",
        left: "33vw",
        height: "64vh",
        width: "34vw",
        background: `url(${SpeechImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "34vw 64vh"
    },
    body: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            margin: "4vh 2vw",
        },
        "& label": {
            "&:nth-child(2)": {
                marginTop: "9vh"
            },
            "&:nth-child(6)": {
                marginTop: "2vh",
                marginBottom: "-2vh"
            },
            color: "black",
            fontSize: "2.6vh",
            marginTop: "5vh"
        },
        "& img": {
            height: "11.31vh",
            width: "5vw",
            marginTop: "5vh"
        },
        marginTop: "12vh",
        padding: "0vh 8vw"
    }
});

const Module_2 = () => {
    const cls = useStyles();

    const history = useHistory();

    const closeRef = useRef();

    const timer = useTimer();

    const [showBGAnimations, setBGAnimation] = useState(false);

    const [isAnimating, setAnimation] = useState(false);

    const [feedback, setFeedback] = useState(false);

    const [shellsArray] = useState(shuffleArray(Array(24).fill().map((_, i) => i)));

    const [trial, setTrial] = useState(0);

    const [shells, setShells] = useState({
        self: 0,
        partner: 0
    });

    const [showBackdrop, hideBackdrop] = useState(false);

    const [isStarted, setStarted] = useState(false);

    const { BGM, data, howler, user } = useContext(AppContext);

    useEffect(() => {
        anime
            .timeline()
            .add({
                targets: "#background",
                opacity: 0,
                easing: "linear",
                duration: 2000,
                complete: () => {
                    $("#background").attr("src", require("../assets/modules/Module_2_BG.jpg"));
                }
            })
            .add({
                targets: "#background",
                opacity: 1,
                easing: "linear",
                changeBegin: () => setBGAnimation(true),
                duration: 2000
            })
            .add({
                targets: "#logo2",
                top: "6vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=1000")
            .add({
                targets: "#instructor",
                left: "0vw",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#board",
                rotateY: ["-90deg", "0deg"],
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000");
    }, []);

    const handleBack = () => {
        anime
            .timeline()
            .add({
                targets: "#background, #bg-animations",
                opacity: 0,
                width: "100vw",
                height: "100vh",
                marginTop: "0vh",
                marginLeft: "0vw",
                easing: "easeInQuint",
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
                targets: "#instructor",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#board",
                rotateY: ["0deg", "90deg"],
                easing: "linear",
                duration: 2000
            }, "-=4000")
            .finished.then(goHome);
    }

    const handleClick = () => {
        anime
            .timeline()
            .add({
                targets: "#board7",
                scale: 0,
                easing: "easeInQuint",
                duration: 500,
                complete: () => {
                    hideBackdrop(false);
                    setStarted(true);
                }
            })
            .add({
                targets: "#instructor",
                left: "-30vw",
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
                left: "1vw",
                easing: "easeOutQuint",
                duration: 2000
            })
            .add({
                targets: "#background",
                width: "180vw",
                height: "180vh",
                marginTop: "-66vh",
                marginLeft: "-76vw",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#palmAlt",
                scale: [0, 1],
                top: "-9vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#guide2",
                left: "76vw",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#close, #music, #shell",
                top: "4vh",
                easing: "easeOutQuint",
                duration: 2000,
                complete: () => {
                    $("#palmAlt, #palmWrapper").toggle();
                    setTimeout(handleRestart, 400);
                }
            }, "-=2000");
    }

    const handleClose = () => {
        closeRef.current = true;

        if (isAnimating) {
            anime({
                targets: "#speech",
                scale: [1, 0],
                easing: "easeInQuint",
                duration: 2000
            });
            anime({
                targets: "#shell2, #shell2Alt, #label, #labelAlt",
                rotateY: ["0deg", "-90deg"],
                easing: "easeInQuint",
                duration: 2000
            });
        }
        else {
            anime({
                targets: "#speech, #shell2, #shell2Alt, #label, #labelAlt",
                opacity: 0,
                duration: 1
            });
        }

        anime
            .timeline()
            .add({
                targets: "#background, #bg-animations",
                opacity: 0,
                width: "100vw",
                height: "100vh",
                marginTop: "0vh",
                marginLeft: "0vw",
                easing: "easeInQuint",
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
                targets: "#guide2",
                left: "130vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#palmWrapper, #palmAlt",
                scale: [1, 0],
                top: "40vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#close, #music, #shell",
                top: "-12vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .finished.then(goHome);
    }

    const handleExit = () => {
        anime
            .timeline()
            .add({
                targets: "#background, #bg-animations",
                opacity: 0,
                width: "100vw",
                height: "100vh",
                marginTop: "0vh",
                marginLeft: "0vw",
                easing: "easeInQuint",
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
            .finished.then(goHome);
    }

    const handleLeave = () => {
        anime({
            targets: "#board7",
            scale: 0,
            easing: "easeInQuint",
            duration: 500,
            complete: () => {
                hideBackdrop(false);
                handleBack();
            }
        })
    }

    const handlePopIn = () => {
        anime({
            targets: "#board7",
            scale: [0, 1],
            duration: 1000,
            begin: () => {
                hideBackdrop(true);
            }
        });
    }

    const handlePopOut = () => {
        anime({
            targets: "#board7",
            scale: 0,
            easing: "easeInQuint",
            duration: 500,
            complete: () => {
                hideBackdrop(false);
            }
        });
    }

    const handleResponse = (flag) => () => {
        score("tree-shaking", {
            session_id: data.session_id,
            trial_number: trial,
            shell: shells.self + shells.partner,
            shared_shell: shells.partner,
            response: flag,
            trial_response_time: timer.getElapsedRunningTime()
        });
        timer.stop();

        new Howl({
            src: require("../assets/sounds/Shell.mp3"),
            autoplay: true
        });

        anime({
            targets: "#speech",
            scale: [1, 0],
            easing: "easeInQuint",
            duration: 2000
        });

        if (flag) {
            anime({
                targets: "#shell2",
                top: "-0.83vh",
                left: "79vw",
                scale: [1, 0.28],
                easing: "easeInQuint",
                duration: 2000,
                complete: () => {
                    anime({
                        targets: "#shell2",
                        scale: 1,
                        top: "78vh",
                        left: "20vw",
                        rotateY: ["0deg", "-90deg"],
                        duration: 1
                    });
                    anime({
                        targets: "#shell",
                        scale: [0.9, 1],
                        delay: 100,
                        duration: 1000
                    });
                }
            });
            anime({
                targets: "#label",
                top: "5.5vh",
                left: "79vw",
                scale: [1, 0.28],
                opacity: 0,
                easing: "easeInQuint",
                duration: 2000,
                complete: () => {
                    anime({
                        targets: "#label",
                        scale: 1,
                        opacity: 1,
                        top: "82vh",
                        left: "20vw",
                        rotateY: ["0deg", "-90deg"],
                        duration: 1
                    });
                }
            });
            anime({
                targets: "#shell2Alt",
                top: "60vh",
                left: "83vw",
                scale: [1, 0.5],
                opacity: 0,
                easing: "easeInQuint",
                duration: 2000,
                complete: () => {
                    anime({
                        targets: "#shell2Alt",
                        scale: 1,
                        opacity: 1,
                        top: "78vh",
                        left: "73vw",
                        rotateY: ["0deg", "-90deg"],
                        duration: 1
                    });
                }
            });
            anime({
                targets: "#labelAlt",
                top: "65.5vh",
                left: "83vw",
                scale: [1, 0.5],
                opacity: 0,
                easing: "easeInQuint",
                duration: 2000,
                complete: () => {
                    anime({
                        targets: "#labelAlt",
                        scale: 1,
                        opacity: 1,
                        top: "82vh",
                        left: "73vw",
                        rotateY: ["0deg", "-90deg"],
                        duration: 1
                    });
                }
            });
        }
        else {
            anime({
                targets: "#shell2, #shell2Alt, #label, #labelAlt",
                opacity: 0,
                easing: "easeInQuint",
                duration: 2000,
                complete: () => {
                    anime({
                        targets: "#shell2, #shell2Alt, #label, #labelAlt",
                        opacity: 1,
                        rotateY: ["0deg", "-90deg"],
                        duration: 1
                    });
                }
            });
        }

        if (trial === 24) {
            setTimeout(() => {
                setFeedback(true);

                new Howl({
                    src: require("../assets/sounds/Activity.mp3"),
                    autoplay: true,
                    onplay: () => {
                        if (howler.module_2.volume())
                            howler.module_2.fade(howler.module_2.volume(), 0.1, 1000);
                    },
                    onend: () => {
                        if (howler.module_2.volume())
                            howler.module_2.fade(0.1, 1, 1000);
                    }
                });

                anime({
                    targets: "#guide",
                    left: "-30vw",
                    easing: "easeInQuint",
                    duration: 2000
                });
                anime({
                    targets: "#guide2",
                    left: "130vw",
                    easing: "easeInQuint",
                    duration: 2000
                });
                anime({
                    targets: "#palmWrapper",
                    scale: [1, 0],
                    top: "40vh",
                    easing: "easeInQuint",
                    duration: 2000
                });
                anime({
                    targets: "#close, #music, #shell",
                    top: "-12vh",
                    easing: "easeInQuint",
                    duration: 2000
                });
            }, 1000);
        }
        else
            setTimeout(handleRestart, 2500);
    }

    const handleRestart = () => {
        setShells({
            self: data.trials[shellsArray[trial]].self,
            partner: data.trials[shellsArray[trial]].partner
        });
        setTrial(trial + 1);
        setAnimation(false);

        anime({
            targets: "#palm",
            translateX: ["68vw", "-2652vw"],
            easing: "steps(40)",
            duration: 1600,
            loop: 2,
            complete: () => {
                $("#palm").css("transform", "translateX(0vw)");
                setAnimation(true);

                if (!closeRef.current) {
                    anime({
                        targets: "#speech",
                        scale: [0, 1],
                        easing: "easeOutQuint",
                        delay: 500,
                        duration: 2000
                    });
                    anime({
                        targets: "#shell2, #shell2Alt, #label, #labelAlt",
                        rotateY: ["-90deg", "0deg"],
                        easing: "easeOutQuint",
                        delay: 750,
                        duration: 2000,
                        complete: () => {
                            timer.start();
                        }
                    });
                }
            }
        });
    }

    const goHome = () => {
        howler.module_2.fade(howler.module_2.volume(), 0, 1000);
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
    }

    return <div>
        {showBGAnimations && <div id="bg-animations">
            <BirdsClouds />
        </div>}
        <img className={cls.logo} id="logo2" src={require("../assets/modules/Module_2_Text.png")} />
        <img className={cls.palmAlt} id="palmAlt" src={require("../assets/modules/Palm-alt.png")} />
        <img className={cls.instructor} id="instructor" src={require("../assets/avatars/xtras/Avatar_11.png")} />
        <img className={cls.guide} id="guide" src={require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <img className={cls.guide2} id="guide2" src={require("../assets/avatars/xtras/Avatar_12.png")} />
        <CIClose className={cls.close} id="close" onClick={handleClose} />
        <CIMusic className={cls.music} id="music" />
        <CIShell className={cls.shell} id="shell" />
        <div className={cls.palmWrapper} style={{ display: "none" }} id="palmWrapper">
            <img className={cls.palm} id="palm" src={require("../assets/modules/Palm.png")} />
        </div>
        <div className={cls.speech} id="speech">
            <CILabel>
                {shells.self} {shells.self === 1 ? "shell has" : "shells have"} fallen to you.
            </CILabel>
            <CILabel>
                {shells.partner} {shells.partner === 1 ? "shell has" : "shells have"} fallen to your partner.
            </CILabel>
            <CILabel>
                Do you want to accept or reject this split?
            </CILabel>
            <div>
                <CIButton alt onClick={handleResponse(true)}>Accept</CIButton>
                <CIButton onClick={handleResponse(false)}>Reject</CIButton>
            </div>
        </div>
        <Shell alt className={cls.shell2} id="shell2" />
        <CILabel className={cls.label} id="label">
            {shells.self}
        </CILabel>
        <Shell alt className={clsx(cls.shell2, cls.shell2Alt)} id="shell2Alt" />
        <CILabel className={clsx(cls.label, cls.labelAlt)} id="labelAlt">
            {shells.partner}
        </CILabel>
        <div className={cls.board} id="board">
            <CILabel className={cls.header}>
                Welcome to the Tree Shaking activity!
            </CILabel>
            <div className={cls.body}>
                <CILabel>
                    In this activity, you will work with a partner to shake trees on the island to get shells. When you shake a tree, different amounts of shells will fall to you and your partner.
                </CILabel>
                <CILabel>
                    After the shells have fallen, you will decide whether to accept the shells that have fallen or to reject the shells that have fallen.
                </CILabel>
                <CILabel>
                    If you accept, then you and your partner will get to keep the shells that have fallen.
                </CILabel>
                <CILabel>
                    If you reject, then you and your partner will not get to keep the shells that have fallen.
                </CILabel>
                <img src={require("../assets/modules/Shell-alt.png")} />
                <CILabel>
                    Are you ready?
                </CILabel>
                <CIButton alt onClick={handlePopIn}>Let's Go!</CIButton>
                <CIButton onClick={handleBack}>Go Back</CIButton>
            </div>
        </div>
        <Backdrop className={cls.backdrop} open={showBackdrop}>
            <div className={cls.board2} id="board7">
                <CILabel>
                    Alright, let's get started then! You are about to start the real activity. Please be sure you fully understand the instructions because you will not be able to return to them later. Remember these decisions help us with real science, so please take them seriously!
                </CILabel>
                <CIButton alt onClick={handleClick}>OK</CIButton>
                <CIButton onClick={handlePopOut}>Go Back</CIButton>
            </div>
        </Backdrop>
        <IdlePrompt handleClose={isStarted ? handleClose : showBackdrop ? handleLeave : handleBack} />
        {feedback && <Feedback module="tree-shaking" onClose={handleExit} />}
    </div>
}

export default Module_2;