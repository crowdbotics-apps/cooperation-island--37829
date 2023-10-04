import { useContext, useEffect, useState } from "react";
import { Backdrop, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapPosters, mapUserData } from "../funnels/v1";
import { anime, parseToken, postersData } from "../libs/utils";
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
    backdrop: {
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
        left: "94vw",
        height: "8.5vh",
        width: "4vw"
    },
    save: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        top: "86vh",
        left: "86vw",
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
        })
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
        showShopPage();
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
                    $("#background").attr("src", posterURL);
                    hidePoster(true);
                    history.push("/poster");
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
                    You'll spend <span>{poster?.shells}</span> shells to get this poster.
                </CILabel>
                <CIButton alt onClick={handleOpen(poster)}>OK</CIButton>
                <CIButton onClick={handleBack}>Go Back</CIButton>
            </div>
        </Backdrop>
    </div>
}

export default ShopPage;