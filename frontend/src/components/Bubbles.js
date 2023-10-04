import { memo, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { anime } from "../libs/utils";

const useStyles = makeStyles({
    bubble: {
        position: "absolute",
        width: "0vw"
    },
    circle: {
        position: "absolute",
        width: "2vw",
        transform: "scale(0)"
    }
});

const bubblesArray = Array(anime.random(60, 100)).fill();

const Bubbles = () => {
    const cls = useStyles();

    useEffect(() => {
        setTimeout(showAnimation(1), 0);
        setTimeout(showAnimation(2), 4000);
        setTimeout(showAnimation(3), 8000);
    }, []);

    const showAnimation = (id) => () => {
        anime({
            targets: `#bubbles${id} .${cls.bubble}`,
            width: {
                value: () => ["0vw", anime.random(25, 200) / 100 + "vw"],
                duration: 1000
            },
            top: "-10vh",
            easing: "linear",
            delay: anime.stagger(anime.random(100, 300)),
            changeComplete: x => setTimeout(x.restart),
            duration: 4000,
            loop: true
        });
        anime({
            targets: `#bubbles${id} .${cls.circle}`,
            scale: () => [0, anime.random(50, 200) / 100],
            top: "-10vh",
            easing: "linear",
            delay: anime.stagger(anime.random(100, 300)),
            changeComplete: x => setTimeout(x.restart),
            duration: 4000,
            loop: true
        });
    }

    return <div>
        {bubblesArray.map((_, i) => <div id={`bubbles${anime.random(1, 3)}`} key={i}>
            <img
                className={cls.bubble}
                style={{
                    left: anime.random(0, 100) + "vw",
                    top: anime.random(60, 120) + "vh"
                }}
                src={require("../assets/modules/Bubbles.png")}
            />
            <svg
                className={cls.circle}
                style={{
                    left: anime.random(0, 100) + "vw",
                    top: anime.random(60, 120) + "vh"
                }}
            >
                <circle cx="10" cy="10" r="10" fill="#FFFFFF8C" />
            </svg>
        </div>)}
    </div>
}

export default memo(Bubbles);