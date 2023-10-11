import { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { mapUserData } from "../funnels/v1";
import { anime, parseToken } from "../libs/utils";
import { refresh as handleRefresh } from "../services/v1";
import { showAvatarPage, showDetailsPage, showHomePage, showLandingPage, showLoginBoard, showReadingPane, showResetPassword, showShopPage } from "../libs/animations";
import LoadAssets from "../components/LoadAssets";
import { AppContext } from "../App";
import { Howl } from "howler";

const useStyles = makeStyles((theme) => ({
    BG: {
        opacity: 0,
        height: "100vh",
        width: "100vw"
    },
    logo: {
        position: "absolute",
        top: "-80vh",
        left: "50vw",
        height: "60vh",
        width: "60vw",
        transform: "translateX(-30vw) translateY(-30vh)"
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

    const { avatarRef, user, setHowler, setUser } = useContext(AppContext);

    const [loadedItems, setLoaded] = useState(0);

    const [fetchStatus, setStatus] = useState(true);

    const allItems = document.querySelectorAll("#assets").length;

    const isLoaded = loadedItems === allItems && allItems !== 0;

    useEffect(() => {
        window.addEventListener("beforeunload", () => {
            window.history.replaceState({}, document.title);
        });

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
                    top: "50vh",
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
                        if (window.location.pathname.includes("/reset-password"))
                            showResetPassword();
                        else if (window.location.pathname.includes("/consent") || window.location.pathname.includes("/assent"))
                            showReadingPane(true);
                        else if (window.location.pathname.includes("/")) {
                            history.push("/login");
                            showLoginBoard(true);
                        }
                        else
                            showLoginBoard(true);
                    }
                    else {
                        handleRefresh()
                            .then(({ data }) => {
                                const userData = parseToken(data.user);

                                if (userData) {
                                    localStorage["UserState"] = data.user;
                                }
                                setUser(mapUserData((userData)));
                            });

                        setHowler({
                            shop: new Howl({
                                src: [require("../assets/sounds/Shop.mp3")],
                                autoplay: true,
                                volume: 0,
                                loop: true
                            }),
                            welcome: new Howl({
                                src: [require("../assets/sounds/Welcome.mp3")],
                                autoplay: true,
                                volume: 0,
                                loop: true
                            })
                        }, 1000);

                        if (window.location.pathname.includes("/access")) {
                            anime({
                                targets: "#logo",
                                top: "-12vh",
                                left: "-12vw",
                                scale: 0.45,
                                translateX: ["-30vw", "0vw"],
                                translateY: ["-30vh", "0vh"],
                                easing: "easeOutQuint",
                                duration: 2000
                            });
                            showLandingPage();
                        }
                        else if (window.location.pathname.includes("/details")) {
                            anime({
                                targets: "#logo",
                                top: "-12vh",
                                left: "-12vw",
                                scale: 0.45,
                                translateX: ["-30vw", "0vw"],
                                translateY: ["-30vh", "0vh"],
                                easing: "easeOutQuint",
                                duration: 2000
                            });
                            showDetailsPage();
                        }
                        else if (window.location.pathname.includes("/avatar")) {
                            anime({
                                targets: "#logo",
                                top: "150vh",
                                easing: "easeInElastic",
                                duration: 2000
                            });
                            showAvatarPage(avatarRef.current.setUser);
                        }
                        else if (window.location.pathname.includes("/shop")) {
                            anime({
                                targets: "#logo",
                                top: "150vh",
                                easing: "easeInElastic",
                                duration: 2000
                            });
                            showShopPage();
                        }
                        else if (window.location.pathname.includes("/home")) {
                            anime({
                                targets: "#logo",
                                top: "-12vh",
                                left: "-12vw",
                                scale: 0.45,
                                translateX: ["-30vw", "0vw"],
                                translateY: ["-30vh", "0vh"],
                                easing: "easeOutQuint",
                                duration: 2000
                            });
                            showHomePage();
                        }
                        else if (window.location.pathname.includes("/")) {
                            if (user.access) {
                                if (user.details) {
                                    if (user.avatar) {
                                        history.push("/home");
                                        anime({
                                            targets: "#logo",
                                            top: "-12vh",
                                            left: "-12vw",
                                            scale: 0.45,
                                            translateX: ["-30vw", "0vw"],
                                            translateY: ["-30vh", "0vh"],
                                            easing: "easeOutQuint",
                                            duration: 2000
                                        });
                                        showHomePage();
                                    }
                                    else {
                                        history.push("/avatar");
                                        anime({
                                            targets: "#logo",
                                            top: "150vh",
                                            easing: "easeInElastic",
                                            duration: 2000
                                        });
                                        showAvatarPage();
                                    }
                                }
                                else {
                                    history.push("/details");
                                    anime({
                                        targets: "#logo",
                                        top: "-12vh",
                                        left: "-12vw",
                                        scale: 0.45,
                                        translateX: ["-30vw", "0vw"],
                                        translateY: ["-30vh", "0vh"],
                                        easing: "easeOutQuint",
                                        duration: 2000
                                    });
                                    showDetailsPage();
                                }
                            }
                            else {
                                history.push("/access");
                                anime({
                                    targets: "#logo",
                                    top: "-12vh",
                                    left: "-12vw",
                                    scale: 0.45,
                                    translateX: ["-30vw", "0vw"],
                                    translateY: ["-30vh", "0vh"],
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
        <div className={cls.root} id="container">
            <img className={cls.BG} id="background" src={require("../assets/images/Application_BG.jpg")} />
            <img className={cls.logo} id="logo" src={require("../assets/images/Logo_Text.png")} />
        </div>
        {(!isLoaded && fetchStatus) && <LoadAssets onLoad={handleLoaded} progress={Math.round((loadedItems / allItems) * 100)} />}
    </Fragment>
}

export default HomePage;