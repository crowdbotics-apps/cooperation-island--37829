import { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { usePrevious } from "../libs/utils";
import AvatarFrame from "../components/AvatarFrame";
import CIButton from "../shared/CIButton";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";
import { AppContext } from "../App";
import { Howl } from "howler";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    avatar: {
        position: "sticky",
        display: "block",
        margin: "0 auto",
        opacity: 0,
        zIndex: 2,
        width: "25vw",
        top: "12vh"
    },
    frame: {
        "&:last-child": {
            marginBottom: "10vh"
        },
        marginTop: "10vh"
    },
    list: {
        position: "absolute",
        paddingLeft: "8vw",
        width: "24vw"
    },
    right: {
        left: "68vw"
    },
    root: {
        "&::-webkit-scrollbar": {
            display: "block",
            width: "0.6vw"
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.primary.main,
            borderRadius: "1vw"
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent"
        },
        position: "absolute",
        height: "141vh",
        width: "100vw",
        top: "0vh",
        overflowX: "hidden"
    },
    svg: {
        position: "sticky",
        display: "block",
        transform: "scale(0)",
        margin: "0 auto",
        width: "20vw",
        marginTop: "-6vh",
        top: "79vh"
    },
    button: {
        position: "sticky",
        display: "block",
        transform: "scale(0)",
        margin: "0 auto",
        width: "10% !important",
        top: "90vh"
    },
    logout: {
        position: "absolute",
        top: "4%",
        left: "100%",
        width: "4vw"
    },
    music: {
        position: "absolute",
        top: "17%",
        left: "100%",
        width: "4vw"
    }
}));

const Avatar = () => {
    const cls = useStyles();

    const history = useHistory();

    const [active, setActive] = useState(0);

    const [avatar, setAvatar] = useState(0);

    const { howler, user } = useContext(AppContext);

    const prevActive = usePrevious(active);

    useEffect(() => {
        if (user.avatar || !user.details)
            history.push("/");
    }, []);

    useEffect(() => {
        if (prevActive) {
            anime
                .timeline()
                .add({
                    targets: `.${cls.avatar}`,
                    rotateY: active > 5 ? "90deg" : "-90deg",
                    easing: "linear",
                    duration: 125,
                    complete: () => {
                        setAvatar(active)
                    }
                })
                .add({
                    targets: `.${cls.avatar}`,
                    rotateY: "0deg",
                    easing: "linear",
                    duration: 125
                })
                .add({
                    targets: `.${cls.svg}`,
                    scale: [1, 0, 1],
                    easing: "linear",
                    duration: 250
                }, "-=300");
        }
        else {
            setAvatar(active);
            anime({
                targets: `.${cls.avatar}`,
                opacity: [0, 1],
                easing: "linear",
                duration: 250
            });
            anime({
                targets: [`.${cls.svg}`, `.${cls.button}`],
                scale: [0, 1],
                easing: "linear",
                duration: 250
            });
        }
    }, [active]);

    const handleClick = (id) => () => {
        new Howl({
            src: require("../assets/sounds/Click.mp3"),
            autoplay: true
        });
        setActive(id);
    }

    const handleSave = () => {
        new Howl({
            src: require("../assets/sounds/Avatar.mp3"),
            autoplay: true,
            onplay: () => {
                if (howler.welcome.volume())
                    howler.welcome.fade(1, 0.1, 1000);
            },
            onend: () => {
                if (howler.welcome.volume())
                    howler.welcome.fade(0.1, 1, 1000);
            }
        });
    }

    return <div className={cls.root} id="avatar-page">
        <div className={cls.list}>
            <AvatarFrame active={active === 1} avatar={1} className={cls.frame} onClick={handleClick(1)} variant={1} />
            <AvatarFrame active={active === 2} avatar={2} className={cls.frame} onClick={handleClick(2)} variant={2} />
            <AvatarFrame active={active === 3} avatar={3} className={cls.frame} onClick={handleClick(3)} variant={3} />
            <AvatarFrame active={active === 4} avatar={4} className={cls.frame} onClick={handleClick(4)} variant={1} />
            <AvatarFrame active={active === 5} avatar={5} className={cls.frame} onClick={handleClick(5)} variant={2} />
        </div>
        <div className={clsx(cls.list, cls.right)}>
            <AvatarFrame active={active === 6} avatar={6} className={cls.frame} onClick={handleClick(6)} variant={3} />
            <AvatarFrame active={active === 7} avatar={7} className={cls.frame} onClick={handleClick(7)} variant={1} />
            <AvatarFrame active={active === 8} avatar={8} className={cls.frame} onClick={handleClick(8)} variant={2} />
            <AvatarFrame active={active === 9} avatar={9} className={cls.frame} onClick={handleClick(9)} variant={3} />
            <AvatarFrame active={active === 10} avatar={10} className={cls.frame} onClick={handleClick(10)} variant={1} />
        </div>
        <CILogout className={cls.logout} id="logout" />
        <CIMusic className={cls.music} id="music" />
        {Boolean(active) && <Fragment>
            <img className={cls.avatar} src={avatar && require(`../assets/avatars/Avatar_${avatar}.png`)} />
            <svg className={cls.svg} viewBox="0 0 370 87">
                <ellipse cx="185" cy="43.5" rx="185" ry="43.5" fill="#29756B" />
            </svg>
            <CIButton className={cls.button} onClick={handleSave}>Save</CIButton>
        </Fragment>}
    </div>
}

export default Avatar;