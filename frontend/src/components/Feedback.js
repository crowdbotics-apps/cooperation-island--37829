import { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { saveFeedback } from "../services/v1";
import BoardImg from "../assets/images/Board.png";
import CIButton from "../shared/CIButton";
import CIInput from "../shared/CIInput";
import CILabel from "../shared/CILabel";
import Option from "./Option";
import Rating from "./Rating";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    animal: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        zIndex: 2,
        top: "8vh",
        left: "61vw",
        height: "16.27vh",
        width: "10vw",
        transform: "scale(0)"
    },
    board: {
        position: "absolute",
        filter: "drop-shadow(0.33vh 0.66vh 1.2vh black)",
        textAlign: "center",
        top: "110vh",
        left: "20vw",
        height: "80vh",
        width: "60vw",
        background: `url(${BoardImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "60vw 80vh"
    },
    pagination: {
        "& svg": {
            fill: theme.palette.primary.main,
            verticalAlign: "middle",
            width: "0.6vw",
            marginRight: "0.65vw"
        },
        height: "2vh",
        marginLeft: "2vw",
        marginTop: "12vh"
    },
    active: {
        fill: theme.palette.primary.BG + " !important",
        width: "0.8vw !important"
    },
    feedback: {
        height: "49.75vh"
    },
    noFeedback: {
        "& label": {
            fontSize: "8vh"
        },
        height: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "2.7vh"
    },
    question: {
        color: "black",
        fontSize: "3.6vh",
        padding: "0 10vw",
        marginTop: "6vh",
        marginBottom: "14vh"
    },
    questionAlt: {
        marginBottom: "20vh"
    },
    options: {
        "& div": {
            "&:first-child": {
                marginLeft: "0.5vw"
            },
            marginLeft: "-4vw"
        },
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: "4vh"
    },
    optionAlt: {
        marginBottom: "11.25vh"
    },
    button: {
        marginTop: "2vh"
    },
    input: {
        margin: "18vh auto 10.75vh",
    },
    rating: {
        margin: "0vh 0.5vw"
    },
    ratingContainer: {
        "& label": {
            "&:last-child": {
                textAlign: "right",
                marginLeft: "40.1vw"
            },
            position: "absolute",
            color: "black",
            filter: "drop-shadow(0.05vh 0.05vh 0.1vh black)",
            textAlign: "left",
            margin: "2vh 9.5vw 0vh"
        },
        margin: "-1vh 0vw 11.8vh 0.5vw"
    }
}));

const Feedback = ({ module, onClose }) => {
    const isRated = module === "tell-us-about-you";

    const cls = useStyles();

    const { feedback } = useContext(AppContext);

    const [active, setActive] = useState(0);

    const [selected, setSelected] = useState([]);

    const [answer, setAnswer] = useState("");

    const [score, setScore] = useState(0);

    const [show, hide] = useState(true);

    useEffect(() => {
        anime
            .timeline()
            .add({
                targets: "#board6",
                top: "10vh",
                easing: "easeInQuint",
                duration: 2000
            })
            .add({
                targets: "#animal",
                top: "2vh",
                scale: [0, 1],
                easing: "easeOutQuint",
                duration: 2000
            });
    }, []);

    useEffect(() => {
        hide(false);
        setTimeout(() => hide(true), 1);
    }, [active]);

    const handleClick = () => {
        if (!feedback.length)
            handleClose();
        else if (feedback[active].question_type === 4 && !score)
            toast.error("You must select a rating.");
        else {
            saveFeedback(module, {
                id: feedback[active].id,
                answer: feedback[active].question_type === 1 ? [answer] : (feedback[active].question_type === 4 ? [score] : selected)
            });

            if (active === feedback.length - 1)
                handleClose();
            else {
                anime
                    .timeline()
                    .add({
                        targets: "#feedback",
                        opacity: [1, 0],
                        easing: "linear",
                        duration: 250,
                        complete: () => {
                            setActive(active + 1);
                            setAnswer("");
                            setScore(0);
                            setSelected([]);
                        }
                    })
                    .add({
                        targets: "#feedback",
                        opacity: [0, 1],
                        easing: "linear",
                        duration: 250
                    });
            }
        }
    }

    const handleClose = () => {
        anime({
            targets: "#board6",
            top: "110vh",
            easing: "easeInQuint",
            duration: 2000
        });
        anime({
            targets: "#animal",
            top: "102vh",
            easing: "easeInQuint",
            duration: 2000
        });
        onClose();
    }

    const handleInput = (event) => {
        setAnswer(event.target.value.trim());
    }

    const handleSelect = (id) => () => {
        if (feedback[active].question_type === 2)
            setSelected([id]);
        else
            setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
    }

    const handleScore = (id) => () => {
        setScore(id);
    }

    return <div>
        <img className={cls.animal} id="animal" src={require(`../assets/animals/Animal_${isRated ? 4 : 3}.png`)} />
        <div className={cls.board} id="board6">
            <div className={cls.pagination}>
                {Array(feedback.length).fill().map((_, i) => {
                    return <svg className={active === i ? cls.active : ""} key={i} viewBox="0 0 13 13">
                        <circle cx="6.5" cy="6.5" r="6.5" />
                    </svg>
                })}
            </div>
            {feedback.length ? (show ? <div id="feedback">
                <CILabel className={clsx(cls.question, feedback[active].options.length === 2 && cls.questionAlt)}>{feedback[active].question}</CILabel>
                {feedback[active].question_type === 1 ? <CIInput autoFocus className={cls.input} onChange={handleInput} placeholder="Answer" value={answer} /> : (feedback[active].question_type === 4 ? <div className={cls.ratingContainer}>
                    <Rating active={score >= 1} className={cls.rating} id="1" onClick={handleScore(1)} />
                    <Rating active={score >= 2} className={cls.rating} id="2" onClick={handleScore(2)} />
                    <Rating active={score >= 3} className={cls.rating} id="3" onClick={handleScore(3)} />
                    <Rating active={score >= 4} className={cls.rating} id="4" onClick={handleScore(4)} />
                    <Rating active={score >= 5} className={cls.rating} id="5" onClick={handleScore(5)} />
                    <CILabel>Not Important</CILabel>
                    <CILabel>Very Important</CILabel>
                </div> : <Fragment>
                    <div className={clsx(cls.options, feedback[active].options.length === 2 && cls.optionAlt)}>
                        <Option
                            active={selected.includes(feedback[active].options[0].id)}
                            id={feedback[active].options[0].id}
                            multiple={feedback[active].question_type === 3}
                            onClick={handleSelect(feedback[active].options[0].id)}
                            text={feedback[active].options[0].text}
                        />
                        <Option
                            active={selected.includes(feedback[active].options[1].id)}
                            id={feedback[active].options[1].id}
                            multiple={feedback[active].question_type === 3}
                            onClick={handleSelect(feedback[active].options[1].id)}
                            text={feedback[active].options[1].text}
                        />
                    </div>
                        {feedback[active].options.length === 4 && <div className={cls.options}>
                        <Option
                            active={selected.includes(feedback[active].options[2].id)}
                            id={feedback[active].options[2].id}
                            multiple={feedback[active].question_type === 3}
                            onClick={handleSelect(feedback[active].options[2].id)}
                            text={feedback[active].options[2].text}
                        />
                        <Option
                            active={selected.includes(feedback[active].options[3].id)}
                            id={feedback[active].options[3].id}
                            multiple={feedback[active].question_type === 3}
                            onClick={handleSelect(feedback[active].options[3].id)}
                            text={feedback[active].options[3].text}
                        />
                    </div>}
                </Fragment>)}
            </div> : <div className={cls.feedback} />) : <div className={cls.noFeedback}>
                <CILabel>No Feedback required.</CILabel>
            </div>}
            <CIButton className={cls.button} onClick={handleClick}>{(!feedback.length || active === feedback.length - 1) ? "Close" : "Next"}</CIButton>
        </div>
    </div>
}

export default Feedback;