import { useContext, useEffect, useState } from "react";
import { Backdrop, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import update from "immutability-helper";
import { rankedQualities } from "../libs/utils";
import { qualities } from "../services/v1";
import { showHomePage } from "../libs/animations";
import BoardImg from "../assets/images/Board.png";
import BoardSmImg from "../assets/images/Board-sm.png";
import BlockImg from "../assets/modules/Block.png";
import SectionsImg from "../assets/modules/Sections.png";
import Section1Img from "../assets/modules/Section_1.png";
import Section2Img from "../assets/modules/Section_2.png";
import Section3Img from "../assets/modules/Section_3.png";
import ValuesImg from "../assets/modules/Values.png";
import Feedback from "../components/Feedback";
import IdlePrompt from "../components/IdlePrompt";
import Qualities from "../components/Qualities";
import Sections from "../components/Sections";
import CIButton from "../shared/CIButton";
import CIClose from "../shared/CIClose";
import CILabel from "../shared/CILabel";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
import { Howl } from "howler";
import anime from "animejs";
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
    sections: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "110vh",
        left: "45vw",
        height: "70vh",
        width: "53vw",
        background: `url(${SectionsImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "53vw 70vh"
    },
    logo: {
        position: "absolute",
        filter: "drop-shadow(0.1vh 0.1vh 0.4vh black)",
        top: "-40vh",
        left: "-1vw",
        height: "21.83vh",
        width: "28vw"
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
    block: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "110vh",
        left: "22vw",
        height: "68vh",
        width: "20vw",
        background: `url(${BlockImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "20vw 68vh"
    },
    container: {
        "&::-webkit-scrollbar": {
            width: "0.4vw"
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.primary.main,
            borderRadius: "1vw"
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent"
        },
        height: "55vh",
        width: "17vw",
        overflow: "hidden scroll",
        marginTop: "5.5vh",
        marginLeft: "1vw"
    },
    section: {
        position: "absolute",
        height: "55vh",
        width: "15vw",
        marginTop: "6.5vh"
    },
    clsSection: {
        "&::-webkit-scrollbar": {
            width: "0.4vw"
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.primary.main,
            borderRadius: "1vw"
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent"
        },
        overflow: "hidden scroll",
        height: "39vh",
        width: "14.6vw",
        marginTop: "5vh",
        marginLeft: "-0.75vw"
    },
    value: {
        height: "8vh",
        width: "15vw",
        filter: "drop-shadow(0.33vh 0.44vh 0.66vh black)",
        touchAction: "none",
        background: `url(${ValuesImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "15vw 8vh"
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
    button: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "110vh",
        left: "54.5vw"
    },
    body: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            margin: "3vh 2vw",
        },
        "& label": {
            "&:first-child": {
                marginTop: "9vh"
            },
            "&:nth-child(3)": {
                marginTop: "28vh"
            },
            "&:nth-child(4)": {
                marginTop: "4vh"
            },
            fontSize: "3vh",
            color: "black",
            marginTop: "7vh"
        },
        padding: "0vh 8vw"
    }
}));

const Module_3 = () => {
    const cls = useStyles();

    const history = useHistory();

    const [state, setState] = useState({
        section1: [],
        section2: [],
        section3: []
    });

    const [feedback, setFeedback] = useState(false);

    const [flag, setFlag] = useState(true);

    const [disabled, setDisabled] = useState(false);

    const [draggingId, setDragging] = useState(0);

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
                    $("#background").attr("src", require("../assets/modules/Module_3_BG.jpg"));
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
                top: "2vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=1000")
            .add({
                targets: "#instructor",
                left: "-0.5vw",
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

    useEffect(() => {
        if (!rankedQualities
            .filter(x => ![...state.section1, ...state.section2, ...state.section3].includes(x.id))
            .length) {
            setDisabled(true);

            anime({
                targets: "#block",
                top: "110vh",
                easing: "easeInQuint",
                duration: 2000
            });
            anime
                .timeline({
                    complete: () => {
                        setDisabled(false);
                    },
                    delay: 500
                })
                .add({
                    targets: "#sections",
                    left: "32vw",
                    top: "18vh",
                    easing: "easeInQuint",
                    duration: 2000
                })
                .add({
                    targets: `.${cls.button}`,
                    top: "90.5vh",
                    easing: "easeOutQuint",
                    duration: 2000
                }, "-=1000");
        }
    }, [state]);

    const addItems = (section) => (id) => {
        setState({
            ...state,
            section1: state.section1.filter(x => x !== id),
            section2: state.section2.filter(x => x !== id),
            section3: state.section3.filter(x => x !== id),
            [section]: [...state[section], id]
        });
    }

    const moveItems = (section) => (x1, x2) => {
        setState((prev) => update(prev, {
            [section]: {
                $splice: [
                    [x1, 1],
                    [x2, 0, prev[section][x1]],
                ]
            }
        }));
    }

    const handleBack = () => {
        anime
            .timeline()
            .add({
                targets: "#background",
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
                    setFeedback(true);
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
            }, "-=2000");
    }

    const handleClose = () => {
        anime
            .timeline()
            .add({
                targets: "#background",
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
                targets: "#block, #sections",
                top: "110vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: `.${cls.button}`,
                top: "192vh",
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
                targets: "#background",
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

    const handleSave = () => {
        qualities([
            ...state.section1
                .map((x, i) => ({
                    session_id: data.session_id,
                    id: x,
                    category: 1,
                    rank: i + 1
                })),
            ...state.section2
                .map((x, i) => ({
                    session_id: data.session_id,
                    id: x,
                    category: 2,
                    rank: i + 1
                })),
            ...state.section3
                .map((x, i) => ({
                    session_id: data.session_id,
                    id: x,
                    category: 3,
                    rank: i + 1
                }))
        ]);
        setFeedback(true);

        new Howl({
            src: require("../assets/sounds/Activity.mp3"),
            autoplay: true,
            onplay: () => {
                if (howler.module_3.volume())
                    howler.module_3.fade(howler.module_3.volume(), 0.1, 1000);
            },
            onend: () => {
                if (howler.module_3.volume())
                    howler.module_3.fade(0.1, 1, 1000);
            }
        });

        anime({
            targets: "#guide",
            left: "-30vw",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#sections",
            top: "110vh",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: `.${cls.button}`,
            top: "192vh",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#close, #music, #shell",
            top: "-12vh",
            easing: "easeInQuint",
            duration: 2000
        });
    }

    const handleStart = () => {
        setFeedback(false);
        setFlag(false);

        anime({
            targets: "#guide",
            left: "1vw",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#block",
            top: "24vh",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#sections",
            top: "23vh",
            easing: "easeOutQuint",
            duration: 2000
        });
        anime({
            targets: "#close, #music, #shell",
            top: "4vh",
            easing: "easeOutQuint",
            duration: 2000
        });
    }

    const goHome = () => {
        howler.module_3.fade(howler.module_3.volume(), 0, 1000);
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
        <img className={cls.logo} id="logo2" src={require("../assets/modules/Module_3_Text.png")} />
        <img className={cls.instructor} id="instructor" src={require("../assets/avatars/xtras/Avatar_2.png")} />
        <img className={cls.guide} id="guide" src={require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <CIClose className={cls.close} id="close" onClick={handleClose} />
        <CIMusic className={cls.music} id="music" />
        <CIShell className={cls.shell} id="shell" />
        <div className={cls.block} id="block">
            <div className={cls.container}>
                {rankedQualities
                    .filter(x => ![...state.section1, ...state.section2, ...state.section3].includes(x.id))
                    .map((quality, i, list) => {
                        return <Qualities
                            className={cls.value}
                            key={quality.id}
                            first={i === 0}
                            last={i === list.length - 1}
                            {...quality}
                        />
                    })}
            </div>
        </div>
        <div className={cls.sections} id="sections">
            <Sections
                addItems={addItems("section1")}
                moveItems={moveItems("section1")}
                className={cls.section}
                data={state.section1}
                clsQuality={cls.value}
                clsSection={cls.clsSection}
                SectionImg={Section1Img}
                style={{
                    marginLeft: "2.25vw"
                }}
                {...{ disabled, draggingId, setDragging }}
            />
            <Sections
                addItems={addItems("section2")}
                moveItems={moveItems("section2")}
                className={cls.section}
                data={state.section2}
                clsQuality={cls.value}
                clsSection={cls.clsSection}
                SectionImg={Section2Img}
                style={{
                    marginLeft: "18.9vw"
                }}
                {...{ disabled, draggingId, setDragging }}
            />
            <Sections
                addItems={addItems("section3")}
                moveItems={moveItems("section3")}
                className={cls.section}
                data={state.section3}
                clsQuality={cls.value}
                clsSection={cls.clsSection}
                SectionImg={Section3Img}
                style={{
                    marginLeft: "35.5vw"
                }}
                {...{ disabled, draggingId, setDragging }}
            />
        </div>
        <CIButton className={cls.button} onClick={handleSave}>Save</CIButton>
        <div className={cls.board} id="board">
            <CILabel className={cls.header}>
                Welcome to the Voice Your Values Activity!
            </CILabel>
            <div className={cls.body}>
                <CILabel>
                    In this activity, you will tell us about things that are important to you.
                </CILabel>
                <CILabel>
                    First, you will drag different values into bins. These bins will be labelled, "Very Important", "A Little Important" or "Not That Important". To learn more about a particular value, hover your cursor over it to get more information. Once you've placed all of the values into the bins, you will need to order the values within each bin. If a value is placed in the #1 position at the top of a bin, that means it is the most important to you within that category. Once you are done, press, "All Finished".
                </CILabel>
                <CILabel>
                    Second, you will rate each of these values individually.
                </CILabel>
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
        {feedback && <Feedback alt={flag} module="voice-your-values" onClose={handleExit} onStart={handleStart} />}
    </div>
}

export default Module_3;