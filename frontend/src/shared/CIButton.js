import { makeStyles } from "@material-ui/core";
import ButtonImg from "../assets/images/Button.png";
import ButtonAltImg from "../assets/images/Button-alt.png";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = (alt) => makeStyles((theme) => ({
    label: {
        color: theme.palette.primary.light,
        fontFamily: "Summer Show",
        fontSize: "3.3vh",
        fontWeight: "400",
        marginTop: "-1.25vh"
    },
    root: {
        border: "none",
        outline: "none",
        height: "7vh",
        width: "8vw",
        padding: "0 2vw",
        background: `url(${alt ? ButtonAltImg : ButtonImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "8vw 7vh"
    }
}));

const CIButton = (props) => {
    const cls = useStyles(props.alt)();

    const buttonId = "button" + anime.random(1, 100);

    const params = { ...props };

    delete params.alt;

    const handleClick = () => {
        new Howl({
            src: require("../assets/sounds/Click.mp3"),
            autoplay: true
        });
        anime({
            targets: "#" + buttonId,
            scale: [0.9, 1],
            duration: 1000
        });
        props.onClick && props.onClick();
    }

    return <button {...params} className={clsx(cls.root, props.className, "pointer")} id={buttonId} onClick={handleClick}>
        <div className={clsx(cls.label, "pointer")}>{props.children}</div>
    </button>
}

export default CIButton;