import CILabel from "../shared/CILabel";

const { makeStyles, Backdrop, LinearProgress } = require("@material-ui/core");

const useStyles = makeStyles({
    backdrop: {
        zIndex: 0,
    },
    grid: {
        position: "absolute",
        height: "100vh",
        width: "100vw",
        marginTop: "-60vh"
    },
    hidden: {
        display: "none"
    },
    label: {
        fontSize: "5vh",
        textShadow: "2px 2px 2px black"
    },
    progress: {
        position: "absolute",
        width: "100vw",
    }
});

const LoadAssets = ({ onLoad, progress }) => {
    const cls = useStyles();

    return <div className={cls.grid}>
        <Backdrop className={cls.backdrop} open>
            <CILabel className={cls.label}>
                Please Wait...
            </CILabel>
        </Backdrop>
        <LinearProgress className={cls.progress} variant="buffer" value={progress} valueBuffer={Math.round(progress + (Math.random() * 10))} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/Avatar_5.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Application_BG.jpg")} />
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
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Switch.png")} />
    </div>
}

export default LoadAssets;