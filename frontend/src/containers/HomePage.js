import { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { showAvatarPage, showHomePage, showLandingPage, showLoginBoard, showReadingPane, showResetPassword } from "../libs/animations";
import LoadAssets from "../components/LoadAssets";
import { AppContext } from "../App";
import anime from "animejs";
import $ from "jquery";

const useStyles = makeStyles((theme) => ({
    BG: {
        opacity: 0,
        height: "100vh",
        width: "100vw"
    },
    logo: {
        position: "absolute",
        top: "-80%",
        left: "50%",
        height: "60vh",
        width: "60vw",
        transform: "translateX(-50%) translateY(-50%)"
    },
    root: {
        background: theme.palette.primary.BG
    },
    hidden: {
        display: "none"
    }
}));

const HomePage = () => {
    const cls = useStyles();

    const history = useHistory();

    const { user } = useContext(AppContext);

    const [loadedItems, setLoaded] = useState(0);

    const [fetchStatus, setStatus] = useState(true);

    const allItems = $("#assets").length;

    const isLoaded = loadedItems === allItems && allItems !== 0;

    useEffect(() => {
        if (isLoaded && fetchStatus) {
            setStatus(false);

            anime
                .timeline({
                    delay: 200
                })
                .add({
                    targets: "#background",
                    opacity: 1,
                    easing: "linear",
                    duration: 2000
                })
                .add({
                    targets: "#logo",
                    top: "58%",
                    easing: "easeOutElastic",
                    duration: 2000
                }, "-=2000")
                .finished.then(() => {
                    anime({
                        targets: "#background",
                        opacity: 0.2,
                        easing: "linear",
                        duration: 2000
                    });
                    if (!user.active) {
                        if (window.location.pathname === "/")
                            history.push("/login");

                        showLoginBoard();
                        showResetPassword();
                        showReadingPane();
                    }
                    else {
                        if (window.location.pathname === "/access") {
                            anime({
                                targets: "#logo",
                                top: "-12%",
                                left: "-12%",
                                scale: 0.45,
                                translateX: ["-50%", "0%"],
                                translateY: ["-50%", "0%"],
                                easing: "easeOutQuint",
                                duration: 2000
                            });
                            showLandingPage();
                        }
                        else if (window.location.pathname === "/avatar") {
                            anime({
                                targets: "#logo",
                                top: "150%",
                                easing: "easeInElastic",
                                duration: 2000
                            });
                            showAvatarPage();
                        }
                        else if (window.location.pathname === "/home") {
                            anime({
                                targets: "#logo",
                                opacity: 0.6,
                                easing: "easeInQuint",
                                duration: 2000
                            });
                            showHomePage();
                        }
                        else if (window.location.pathname === "/") {
                            if (user.access) {
                                if (user.avatar) {
                                    history.push("/home");
                                    anime({
                                        targets: "#logo",
                                        opacity: 0.6,
                                        easing: "easeInQuint",
                                        duration: 2000
                                    });
                                    showHomePage();
                                }
                                else {
                                    history.push("/avatar");
                                    anime({
                                        targets: "#logo",
                                        top: "150%",
                                        easing: "easeInElastic",
                                        duration: 2000
                                    });
                                    showAvatarPage();
                                }
                            }
                            else {
                                history.push("/access");
                                anime({
                                    targets: "#logo",
                                    top: "-12%",
                                    left: "-12%",
                                    scale: 0.45,
                                    translateX: ["-50%", "0%"],
                                    translateY: ["-50%", "0%"],
                                    easing: "easeOutQuint",
                                    duration: 2000
                                });
                                showLandingPage();
                            }
                        }
                    }
                });
        }
    }, [loadedItems, fetchStatus]);

    const handleLoaded = () => {
        setLoaded(x => x + 1);
    }

    return <Fragment>
        <div className={cls.root}>
            <img className={cls.BG} id="background" src={require("../assets/images/Application_BG.jpg")} />
            <img className={cls.logo} id="logo" src={require("../assets/images/Logo_Text.png")} />
        </div>
        {(!isLoaded && fetchStatus) && <LoadAssets onLoad={handleLoaded} progress={Math.round((loadedItems / allItems) * 100)} />}
    </Fragment>
}

export default HomePage;