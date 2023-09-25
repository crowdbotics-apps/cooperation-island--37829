import { Fragment, memo, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { anime } from "../libs/utils";

const useStyles = makeStyles({
    birdsWrapper: {
        position: "absolute",
        overflow: "hidden",
        left: "-15vw",
        height: "10vw",
        width: "10vw"
    },
    birds: {
        width: "40.4vw",
        height: "10.1vw",
        marginTop: "-0.2vw",
        marginLeft: "-0.2vw"
    },
    clouds: {
        position: "absolute",
        left: "-30vw"
    }
});

const birdsArray = Array(anime.random(10, 20)).fill();
const cloudsArray = Array(anime.random(5, 10)).fill();

let bDelay = 0, cDelay = 0;

const BirdsClouds = () => {
    const cls = useStyles();

    useEffect(() => {
        birdsArray.forEach((_, i) => {
            setTimeout(showBirdsAnimation(i), bDelay);
            bDelay += anime.random(400, 1200);
        });
        cloudsArray.forEach((_, i) => {
            setTimeout(showCloudsAnimation(i), cDelay);
            cDelay += anime.random(8000, 12000);
        });
    }, []);

    const showBirdsAnimation = (id) => () => {
        anime({
            targets: "#birds" + id,
            translateX: ["10vw", "-30vw"],
            loop: true,
            easing: "steps(4)",
            duration: 800
        });
        anime({
            targets: "#birdsWrapper" + id,
            left: "110vw",
            easing: "linear",
            loop: true,
            duration: 10000
        });
    }

    const showCloudsAnimation = (id) => () => {
        anime({
            targets: "#clouds" + id,
            left: "110vw",
            easing: "linear",
            loop: true,
            duration: 60000
        });
    }

    return <Fragment>
        {birdsArray.map((_, i) => <div
            className={cls.birdsWrapper}
            key={i}
            id={"birdsWrapper" + i}
            style={{
                top: `${anime.random(1, 12)}vh`,
                transform: `scale(${anime.random(10, 75) / 100})`
            }}
        >
            <img className={cls.birds} id={"birds" + i} src={require("../assets/modules/Birds.png")} />
        </div>)}
        {cloudsArray.map((_, i) => {
            return <img
                className={cls.clouds}
                key={i}
                id={"clouds" + i}
                src={require(`../assets/modules/Clouds_${anime.random(1, 6)}.png`)}
                style={{
                    top: `${anime.random(1, 4)}vh`,
                    width: `${anime.random(4, 14)}vw`,
                }}
            />
        })}
    </Fragment>
}

export default memo(BirdsClouds);