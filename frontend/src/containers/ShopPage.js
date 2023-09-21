import { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showHomePage } from "../libs/animations";
import CIClose from "../shared/CIClose";
import CIMusic from "../shared/CIMusic";
import CIShell from "../shared/CIShell";
import { AppContext } from "../App";
import anime from "animejs";
import clsx from "clsx";
import $ from "jquery";

const useStyles = makeStyles({
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
    }
});

const ShopPage = () => {
    const cls = useStyles();

    const history = useHistory();

    const { BGM, howler, user } = useContext(AppContext);

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

    return <div>
        <img className={cls.logo} id="logo2" src={require("../assets/images/Shop_Text.png")} />
        <img className={clsx(cls.guide, cls["guide" + user.avatar])} id="guide" src={require(`../assets/avatars/Avatar_${user.avatar}.png`)} />
        <CIClose className={cls.close} id="close" onClick={handleClose} />
        <CIMusic className={cls.music} id="music" />
        <CIShell className={cls.shell} id="shell" />
    </div>
}

export default ShopPage;