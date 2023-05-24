import { makeStyles } from "@material-ui/core";
import { Howl } from "howler";
import ButtonImg from "../assets/images/Button.png";
import ButtonAltImg from "../assets/images/Button-alt.png";
import anime from "animejs";
import clsx from "clsx";

const useStyles = (alt) => makeStyles((theme) => ({
    root: {
        border: "none",
        backgroundPositionY: "2vh",
        color: theme.palette.primary.light,
        fontFamily: "Summer Show",
        fontSize: "3.3vh",
        fontWeight: "400",
        outline: "none",
        height: "10vh",
        width: "50%",
        background: `url(${alt ? ButtonAltImg : ButtonImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    }
}));

const CIButton = (props) => {
    const cls = useStyles(props.alt)();

    const buttonId = "button" + anime.random(1, 100);

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

    return <button {...props} className={clsx(cls.root, props.className, "pointer")} id={buttonId} onClick={handleClick} />
}

export default CIButton;