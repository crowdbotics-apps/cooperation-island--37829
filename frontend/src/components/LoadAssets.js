import { makeStyles, Backdrop, LinearProgress } from "@material-ui/core";
import LogoText from "./LogoText";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 0,
    },
    grid: {
        height: "100vh",
        width: "100vw",
        marginTop: "-100vh"
    },
    hidden: {
        display: "none"
    },
    progress: {
        height: "0.7vh",
        marginTop: "98.5vh"
    },
    bar: {
        backgroundColor: theme.palette.primary.light
    }
}));

const LoadAssets = ({ onLoad, progress }) => {
    const cls = useStyles();

    return <div className={cls.grid}>
        <Backdrop className={cls.backdrop} open>
            <LogoText />
        </Backdrop>
        <LinearProgress classes={{ root: cls.progress, bar2Buffer: cls.bar }} variant="buffer" value={progress} valueBuffer={Math.round(progress + (Math.random() * 10))} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/animals/Animal_1.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_5.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_6.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_7.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_8.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_9.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xs/Avatar_10.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_5.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_6.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_7.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_8.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_9.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_10.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Application_BG.jpg")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Avatar_BG.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Board-lg.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Board.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Button-alt.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Button.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Cursor.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Header.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-disabled.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-md.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-sm.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-xs.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Logo_Text.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Logout.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Pointer.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Switch.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Typer.png")} />

        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Avatar.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Click.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Welcome.mp3")} />
    </div>
}

export default LoadAssets;