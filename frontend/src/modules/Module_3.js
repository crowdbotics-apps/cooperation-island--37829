import { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { rankedQualities } from "../libs/utils";
import { showHomePage } from "../libs/animations";
import BoardImg from "../assets/images/Board-alt.png";
import BlockImg from "../assets/modules/Block.png";
import SectionsImg from "../assets/modules/Sections.png";
import ValuesImg from "../assets/modules/Values.png";
import CIButton from "../shared/CIButton";
import CIClose from "../shared/CIClose";
import CILabel from "../shared/CILabel";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
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
        left: "2vw",
        height: "22.95vh",
        width: "21vw"
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
        maxHeight: "55vh",
        width: "17vw",
        overflow: "hidden scroll",
        marginTop: "5.5vh",
        marginLeft: "1vw"
    },
    value: {
        "&:first-child": {
            marginTop: "2vh"
        },
        "&:last-child": {
            marginBottom: "2vh"
        },
        "& label": {
            color: theme.palette.primary.contrast,
            paddingTop: "1.75vh"
        },
        textAlign: "center",
        marginTop: "3vh",
        marginLeft: "1vw",
        marginRight: "1vw",
        height: "8vh",
        width: "15vw",
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
    body: {
        "& button": {
            backgroundSize: "10vw 7vh",
            width: "10vw",
            marginTop: "4vh"
        },
        "& label": {
            "&:nth-child(2)": {
                marginTop: "15vh"
            },
            "&:nth-child(3)": {
                marginTop: "23vh"
            },
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

const Module_3 = () => {
    const cls = useStyles();

    const history = useHistory();

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
                top: "4vh",
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

    const handleClick = () => {
        anime
            .timeline()
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
                targets: "#block",
                top: "23vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
            .add({
                targets: "#sections",
                top: "22vh",
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
                targets: "#block, #sections",
                top: "110vh",
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
            });
    }

    return <div>
        <img className={cls.logo} id="logo2" src={require("../assets/modules/Module_3_Text.png")} />
        <img className={cls.instructor} id="instructor" src={require("../assets/avatars/xtras/Avatar_13.png")} />
        <img className={cls.guide} id="guide" src={require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <CIClose className={cls.close} id="close" onClick={handleClose} />
        <CIMusic className={cls.music} id="music" />
        <CIShell className={cls.shell} id="shell" />
        <div className={cls.board} id="board">
            <CILabel className={cls.header}>
                Welcome to the Tell Us About You activity!
            </CILabel>
            <div className={cls.body}>
                <CILabel>
                    In this activity you will tell us about things that are important to you, about yourself.
                </CILabel>
                <CILabel>
                    You can drag each value into one of the three sections! You can also rank them within each box! The values that are closest to your avatar are the most important, and the ones furthest away are the least important.
                </CILabel>
                <CILabel>
                    Are you ready?
                </CILabel>
                <CIButton onClick={handleClick}>Let's GO</CIButton>
            </div>
        </div>
        <div className={cls.block} id="block">
            <div className={cls.container}>
                {rankedQualities.map(quality => {
                    return <div className={clsx(cls.value, "pointer")}>
                        <CILabel className="pointer">
                            {quality}
                        </CILabel>
                    </div>
                })}
            </div>
        </div>
        <div className={cls.sections} id="sections" />
    </div>
}

export default Module_3;