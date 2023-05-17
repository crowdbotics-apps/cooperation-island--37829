import { makeStyles } from "@material-ui/core";
import anime from "animejs";
import clsx from "clsx";

const useStyles = (alt) => makeStyles((theme) => ({
    root: {
        border: "none",
        backgroundPositionY: "2vh",
        color: theme.palette.primary.light,
        cursor: "pointer",
        fontFamily: "Summer Show",
        fontSize: "3.3vh",
        fontWeight: "400",
        outline: "none",
        height: "10vh",
        width: "50%",
        background: alt ? "url('/images/Button-alt.png')" : "url('/images/Button.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    }
}));

const CIButton = (props) => {
    const cls = useStyles(props.alt)();

    const buttonId = "button" + anime.random(1, 100);

    const handleClick = () => {
        anime({
            targets: "#" + buttonId,
            scale: [0.9, 1],
            duration: 1000
        });
        props.onClick && props.onClick();
    }

    return <button {...props} className={clsx(cls.root, props.className)} id={buttonId} onClick={handleClick} />
}

export default CIButton;