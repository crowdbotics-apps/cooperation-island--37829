import { makeStyles, Backdrop, LinearProgress } from "@material-ui/core";
import LogoText from "./LogoText";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 0
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
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/animals/Animal_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/animals/Animal_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/animals/Animal_4.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_5.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_6.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_7.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_8.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_9.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/aqua/Avatar_10.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_5.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_6.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_7.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_8.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_9.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_10.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_11.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_12.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_13.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_14.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_15.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_16.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_17.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_18.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_19.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_20.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_21.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/partners/Avatar_22.png")} />

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

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xtras/Avatar_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/avatars/xtras/Avatar_2.png")} />

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

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_5.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_6.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_7.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_8.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_9.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_10.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_11.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_12.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_13.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_14.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_15.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_16.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_17.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_18.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_19.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_20.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_21.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_22.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_23.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_24.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/fishes/Fish_25.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Application_BG.jpg")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Avatar_BG.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Avatar_Text.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Board.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Board-alt.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Board-lg.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Board-sm.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Button.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Button-alt.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Frame.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Frame-alt.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Cursor.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Header.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-disabled.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-md.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-sm.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Input-xs.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Logo_Text.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Name_Plate.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Pointer.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Shell.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Spinner.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Switch.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/images/Typer.png")} />

        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Birds.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Block.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Bubbles.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Clouds_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Clouds_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Clouds_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Clouds_4.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Clouds_5.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Clouds_6.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Dialog.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_1_BG.jpg")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_1_Text.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_2_BG.jpg")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_2_Text.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_3_BG.jpg")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Module_3_Text.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Palm.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Palm-alt.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Section_1.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Section_2.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Section_3.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Sections.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Shell.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Speech.png")} />
        <img className={cls.hidden} id="assets" onLoad={onLoad} src={require("../assets/modules/Values.png")} />

        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Activity.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Avatar.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Click.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Module.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Module_1.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Module_2.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Module_3.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Number.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Pick_Up.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Put_Down.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Shell.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Rating.mp3")} />
        <audio className={cls.hidden} id="assets" onCanPlay={onLoad} src={require("../assets/sounds/Welcome.mp3")} />
    </div>
}

export default LoadAssets;