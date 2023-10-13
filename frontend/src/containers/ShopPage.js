import { useContext, useEffect, useState } from "react";
import { Backdrop, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapPosters, mapUserData } from "../funnels/v1";
import { anime, parseToken, posterColors, postersData } from "../libs/utils";
import { buyPoster, moduleData, openPoster, sendPoster } from "../services/v1";
import { showHomePage, showShopPage } from "../libs/animations";
import BoardImg from "../assets/images/Board-sm.png";
import PosterFrame from "../components/PosterFrame";
import Shell from "../components/Shell";
import CIButton from "../shared/CIButton";
import CIClose from "../shared/CIClose";
import CILabel from "../shared/CILabel";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import { Howl } from "howler";
import clsx from "clsx";
import $ from "jquery";

const useStyles = makeStyles((theme) => ({
    guide: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        left: "-30vw",
        height: "66.2vh",
        width: "22vw",
        transform: "scaleX(-1)"
    },
    guide1: {
        top: "36.5vh"
    },
    guide2: {
        top: "36vh"
    },
    guide3: {
        top: "35vh"
    },
    guide4: {
        top: "34.5vh"
    },
    guide5: {
        top: "35.75vh"
    },
    guide6: {
        top: "37vh"
    },
    guide7: {
        top: "34vh"
    },
    guide8: {
        top: "35.75vh"
    },
    guide9: {
        top: "34.25vh"
    },
    guide10: {
        top: "34.25vh"
    },
    board: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            margin: "12vh 3vw 0vh",
        },
        "& label": {
            "& span": {
                color: "black"
            },
            fontSize: "4.5vh",
            marginTop: "12vh",
            padding: "0vh 7vw"
        },
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        textAlign: "center",
        top: "30vh",
        left: "25vw",
        height: "40vh",
        width: "50vw",
        transform: "scale(0)",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "50vw 40vh"
    },
    board2: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            margin: "14vh 0vw",
        },
        "& label": {
            "&:first-child": {
                color: theme.palette.primary.main,
                fontSize: "4.5vh",
                margin: "14vh 0vw 8vh",
            },
            fontSize: "3.3vh",
            color: "black",
            marginTop: "5vh",
            padding: "0vh 7vw"
        },
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        textAlign: "center",
        top: "6vh",
        left: "17vw",
        height: "88vh",
        width: "66vw",
        transform: "scale(0)",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "66vw 88vh"
    },
    backdrop: {
        zIndex: 5
    },
    backdrop2: {
        display: "none",
        zIndex: 5
    },
    hidden: {
        display: "none"
    },
    logo: {
        position: "absolute",
        top: "-20vh",
        left: "35vw",
        height: "15.94vh",
        width: "30vw"
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
    poster: {
        transform: "scale(0)"
    },
    exit: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "-12vh",
        left: "85.3vw",
        height: "8.5vh",
        width: "4vw"
    },
    save: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "86vh",
        left: "77.3vw",
        height: "8.88vh",
        width: "12vw",
        transform: "scale(0)"
    },
    container: {
        "&::-webkit-scrollbar": {
            display: "block",
            width: "0.6vw"
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.primary.main,
            borderRadius: "1vw"
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent"
        },
        position: "absolute",
        overflowY: "scroll",
        paddingTop: "4vh",
        paddingLeft: "30vw",
        width: "70vw",
        top: "24vh"
    }
}));

const ShopPage = () => {
    const cls = useStyles();

    const history = useHistory();

    const [posters, setPosters] = useState(postersData);

    const [sessionId, setSession] = useState();

    const [showBackdrop, hideBackdrop] = useState(false);

    const [showPoster, hidePoster] = useState(false);

    const [poster, setPoster] = useState();

    const { BGM, howler, user, setUser } = useContext(AppContext);

    useEffect(() => {
        moduleData("theme")
            .then(({ data: { session_id, themes } }) => {
                setSession(session_id);
                setPosters(mapPosters(themes));
            });
    }, []);

    const handleBack = () => {
        anime({
            targets: "#board9",
            scale: 0,
            easing: "easeInQuint",
            duration: 500,
            complete: () => {
                hideBackdrop(false);
            }
        });
    }

    const handleClick = (poster) => () => {
        setPoster(poster);

        if (!user.posters.includes(poster.id)) {
            anime({
                targets: "#board9",
                scale: [0, 1],
                duration: 1000,
                begin: () => {
                    hideBackdrop(true);
                }
            });
        }
        else
            handleOpen(poster)();
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
                    $("#background")
                        .attr("src", require("../assets/images/Application_BG.jpg"))
                        .css("filter", "");
                }
            })
            .add({
                targets: "#background",
                opacity: 1,
                easing: "linear",
                duration: 2000
            })
            .add({
                targets: "#logo",
                top: "-12vh",
                left: "-50vw",
                easing: "easeInQuint",
                duration: 1
            }, "-=4000")
            .add({
                targets: "#guide",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#logo2",
                top: "-20vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "[data-name=posters]",
                scale: 0,
                easing: "easeInQuint",
                duration: 2000,
            }, "-=4000")
            .add({
                targets: "#posters-container",
                height: "128vh",
                easing: "linear",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#close, #music, #shell",
                top: "-12vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .finished.then(() => {
                howler.shop.fade(howler.shop.volume(), 0, 1000);
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

    const handleLeave = () => {
        hidePoster(false);
        history.push("/shop");

        anime({
            targets: "#exit",
            top: "-12vh",
            easing: "easeInQuint",
            duration: 2000
        })
        anime({
            targets: "#save",
            scale: 0,
            easing: "easeInQuint",
            duration: 2000
        });
        showShopPage(true);
    }

    const handleOK = () => {
        anime({
            targets: "#board10",
            scale: 0,
            easing: "easeInQuint",
            duration: 500,
            complete: () => {
                $("#backdrop").toggle();
            }
        });
    }

    const handleOpen = (poster) => () => {
        let posterURL;

        if (!user.posters.includes(poster.id)) {
            buyPoster({
                session_id: sessionId,
                theme_id: poster.id
            })
                .then(({ data }) => {
                    const userData = parseToken(data.user);

                    if (userData) {
                        localStorage["UserState"] = data.user;
                    }

                    setUser(mapUserData((userData)));

                    posterURL = data.url;
                    $("#poster").attr("src", posterURL);
                });
            handleBack();
        }
        else {
            openPoster(poster.id)
                .then(({ data }) => {
                    posterURL = data.url;
                    $("#poster").attr("src", posterURL);
                });
        }

        anime
            .timeline()
            .add({
                targets: "#background",
                opacity: 0,
                easing: "linear",
                duration: 2000,
                complete: () => {
                    $("#background")
                        .attr("src", posterURL)
                        .css({
                            boxShadow: `0 0 50vh 5vw ${posterColors[poster.id - 1]}`,
                            filter: "",
                            marginLeft: "8.7vw",
                            width: "82.6vw"
                        });
                    hidePoster(true);
                    history.push("/poster");
                }
            })
            .add({
                targets: "#container",
                background: "#000",
                easing: "linear",
                duration: 2000,
            }, "-=2000")
            .add({
                targets: "#background",
                opacity: 1,
                easing: "linear",
                duration: 2000
            })
            .add({
                targets: "#logo",
                top: "-12vh",
                left: "-50vw",
                easing: "easeInQuint",
                duration: 1
            }, "-=4000")
            .add({
                targets: "#guide",
                left: "-30vw",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#logo2",
                top: "-20vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "[data-name=posters]",
                scale: 0,
                easing: "easeInQuint",
                duration: 2000,
            }, "-=4000")
            .add({
                targets: "#posters-container",
                height: "128vh",
                easing: "linear",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#close, #music, #shell",
                top: "-12vh",
                easing: "easeInQuint",
                duration: 2000
            }, "-=4000")
            .add({
                targets: "#exit",
                top: "4vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#save",
                scale: [0, 1],
                duration: 2000
            }, "-=2000");
    }

    const handleSave = () => {
        new Howl({
            src: require("../assets/sounds/Click.mp3"),
            autoplay: true
        });

        anime({
            targets: "#save",
            scale: [0.9, 1],
            duration: 1000
        });

        sendPoster(poster.id)
            .then(() => {
                toast.success("The poster has been sent to your Email.");
            });
    }

    return <div>
        <img className={cls.logo} id="logo2" src={require("../assets/images/Shop_Text.png")} />
        <img className={clsx(cls.guide, cls["guide" + user.avatar])} id="guide" src={require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <img className={clsx(cls.save, "pointer")} id="save" onClick={handleSave} src={require("../assets/images/Save.png")} />
        <img id="poster" />
        <CIClose className={cls.close} id="close" onClick={handleClose} />
        <CIMusic className={cls.music} id="music" />
        <CIShell className={cls.shell} id="shell" />
        <Shell className={clsx(cls.exit, "pointer")} id="exit" pointer onClick={handleLeave} />
        {posters.length ? <div className={clsx(cls.container, showPoster && cls.hidden)} id="posters-container">
            {posters.map((poster, i) => <PosterFrame className={cls.poster} key={i} {...poster} onClick={handleClick(poster)} />)}
        </div> : ""}
        <Backdrop className={cls.backdrop} open={showBackdrop}>
            <div className={cls.board} id="board9">
                <CILabel>
                    Are you sure you want to spend <span>{poster?.shells}</span> shells on this Avatar Experience?
                </CILabel>
                <CIButton alt onClick={handleOpen(poster)}>Yes</CIButton>
                <CIButton onClick={handleBack}>No</CIButton>
            </div>
        </Backdrop>
        <Backdrop className={cls.backdrop2} open id="backdrop">
            <div className={cls.board2} id="board10">
                <CILabel>
                    Welcome to the Shell Shop!
                </CILabel>
                <CILabel>
                    Here is where you can exchange your shells for different Avatar Experience posters!
                </CILabel>
                <CILabel>
                    Each poster costs a certain amount of shells.
                </CILabel>
                <CILabel>
                    Once you spend those shells, you cannot get them back.
                </CILabel>
                <CILabel>
                    When you spend those shells, you will get to see your Avatar Experience.
                </CILabel>
                <CILabel>
                    You can also click the “Send” button and your parent will receive your Avatar Experience poster AND a coloring page of the poster that you can print and color at home.
                </CILabel>
                <CIButton onClick={handleOK}>OK</CIButton>
            </div>
        </Backdrop>
    </div>
}

export default ShopPage;