import { makeStyles } from "@material-ui/core";
import BoardImg from "../assets/images/Board.png";
import CIButton from "../shared/CIButton";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import CILogout from "../shared/CILogout";
import CIMusic from "../shared/CIMusic";

const useStyles = makeStyles({
    animal: {
        position: "absolute",
        zIndex: 2,
        top: "38%",
        left: "48%",
        height: "41vh",
        width: "11vw",
        transform: "scale(0)"
    },
    guide: {
        position: "absolute",
        top: "38%",
        left: "71%",
        height: "58vh",
        width: "20vw",
        transform: "scale(0)"
    },
    board: {
        position: "absolute",
        top: "76%",
        left: "52%",
        height: "110vh",
        width: "30vw",
        rotate: "90deg",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
    },
    body: {
        "& button": {
            width: "26%"
        },
        "& input": {
            marginTop: "1vh",
            marginBottom: "3vh",
            marginLeft: "9vw"
        },
        "& label": {
            "&:first-child": {
                fontSize: "2.5vh",
                letterSpacing: "0.1vw",
                paddingTop: "3vh",
                marginBottom: "14vh"
            },
            width: "100%"
        },
        rotate: "-90deg",
        height: "48vh",
        width: "126%",
        marginTop: "47%",
        marginLeft: "-12%",
        textAlign: "center"
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
});

const LandingPage = () => {
    const cls = useStyles();

    return <div>
        <img className={cls.animal} id="animal" src={require("../assets/animals/Animal_1.png")} />
        <img className={cls.guide} id="guide" src={require("../assets/avatars/Avatar_6.png")} />
        <div className={cls.board} id="board4">
            <div className={cls.body}>
                <CILabel>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.</CILabel>
                <CILabel>Access Code</CILabel>
                <CIInput />
                <CIButton>Submit</CIButton>
            </div>
        </div>
        <CILogout className={cls.logout} id="logout" />
        <CIMusic className={cls.music} id="music" />
    </div>
}

export default LandingPage;