import { makeStyles } from "@material-ui/core";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.main,
        display: "block",
        fontFamily: "Summer Show",
        fontSize: "3.3vh",
        fontWeight: "400",
        letterSpacing: 0,
        textDecoration: "underline"
    }
}));

const CILink = (props) => {
    const cls = useStyles();

    const labelId = "label" + anime.random(1, 100);

    const handleClick = () => {
        new Howl({
            src: require("../assets/sounds/Click.mp3"),
            autoplay: true
        });
        anime({
            targets: "#" + labelId,
            letterSpacing: [1, 0],
            duration: 1000
        });
        props.onClick && props.onClick();
    }

    return <label {...props} className={clsx(cls.root, props.className, "pointer")} id={labelId} onClick={handleClick} />
}

export default CILink;