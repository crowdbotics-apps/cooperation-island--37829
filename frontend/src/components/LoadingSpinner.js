import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import anime from "animejs";

const useStyles = makeStyles({
    root: {
        height: "10vh",
        width: "5vw",
        overflow: "hidden",
        zoom: 1.5
    },
    spinner: {
        height: "10vh",
        width: "89vw",
        marginTop: "0.16vh",
        marginLeft: "0.33vw"
    }
});

const LoadingSpinner = () => {
    const cls = useStyles();

    useEffect(() => {
        anime({
            targets: `.${cls.root}`,
            rotate: [0, 360],
            easing: "linear",
            duration: 1800,
            loop: true
        });
        anime({
            targets: `.${cls.spinner}`,
            translateX: ["4.45vw", "-84.55vw"],
            easing: "steps(20)",
            direction: "alternate",
            duration: 500,
            loop: true
        });
    }, []);

    return <div className={cls.root}>
        <img className={cls.spinner} src={require("../assets/images/Spinner.png")} />
    </div>
}

export default LoadingSpinner;