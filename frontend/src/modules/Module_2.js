import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import anime from "animejs";
import $ from "jquery";

const useStyles = makeStyles({
    logo: {
        position: "absolute",
        filter: "drop-shadow(0.1vh 0.1vh 0.4vh black)",
        top: "-40vh",
        left: "1.5vw",
        height: "22.95vh",
        width: "21vw"
    },
    palm: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        transform: "scale(0)",
        top: "40vh",
        left: "14vw",
        height: "120.52vh",
        width: "68vw"
    }
});

const Module_2 = () => {
    const cls = useStyles();

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
                duration: 2000
            })
            .add({
                targets: "#logo2",
                top: "6vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=1000")
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
                targets: "#palm",
                scale: [0, 1],
                top: "-18vh",
                easing: "easeOutQuint",
                duration: 2000
            }, "-=2000")
    }, []);

    return <div>
        <img className={cls.logo} id="logo2" src={require("../assets/modules/Module_2_Text.png")} />
        <img className={cls.palm} id="palm" src={require("../assets/modules/Palm.png")} />
    </div>
}

export default Module_2;