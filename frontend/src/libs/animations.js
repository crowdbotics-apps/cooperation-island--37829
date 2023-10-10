import { anime } from "../libs/utils";
import $ from "jquery";

export const showLoginBoard = (alt) => {
    anime({
        targets: "#logo",
        top: "-12vh",
        left: "-12vw",
        scale: 0.45,
        translateX: alt ? ["-30vw", "0vw"] : "0vw",
        translateY: alt ? ["-30vh", "0vh"] : "0vh",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "7vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#board",
        left: "63vw",
        easing: "easeOutQuint",
        duration: 2000
    });
}

export const showResetPassword = () => {
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
    anime({
        targets: "#guide",
        left: "7vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#board2",
        left: "40vw",
        easing: "easeOutQuint",
        duration: 2000
    });
}

export const showReadingPane = (alt) => {
    anime({
        targets: "#logo",
        top: "-12vh",
        left: "-12vw",
        scale: 0.45,
        translateX: alt ? ["-30vw", "0vw"] : "0vw",
        translateY: alt ? ["-30vh", "0vh"] : "0vh",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#guide",
        left: "7vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#board3",
        left: "42vw",
        easing: "easeOutQuint",
        duration: 2000
    });
}

export const showLandingPage = () => {
    anime({
        targets: "#guide2",
        left: "7vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime
        .timeline()
        .add({
            targets: "#board5",
            top: "14vh",
            easing: "easeOutQuint",
            duration: 2000
        })
        .add({
            targets: "#animal2",
            top: "5vh",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#logout, #music",
            left: "94vw",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=1200");
}

export const showDetailsPage = () => {
    anime({
        targets: "#guide",
        left: "7vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime
        .timeline()
        .add({
            targets: "#board",
            left: "34vw",
            easing: "easeOutQuint",
            duration: 2000
        })
        .add({
            targets: "#logout, #music",
            left: "94vw",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=1200");
}

export const showAvatarPage = (callbackFn) => {
    anime
        .timeline()
        .add({
            targets: "#background",
            opacity: 0,
            easing: "linear",
            duration: 2000,
            complete: () => {
                $("#background").attr("src", require("../assets/images/Avatar_BG.png"));
            }
        })
        .add({
            targets: "#background",
            opacity: 1,
            easing: "linear",
            duration: 2000
        })
        .add({
            targets: "#logo2",
            scale: [0, 1],
            easing: "easeOutQuint",
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#logout, #music",
            left: "94vw",
            easing: "easeOutQuint",
            duration: 2000,
            complete: () => {
                $("#logout, #music").css("position", "sticky");
                callbackFn && callbackFn();
            }
        }, "-=2000")
        .add({
            targets: "#frame",
            scale: [0, 1],
            delay: (_, i) => i % 5 * 300,
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#avatar-frames, #avatar-page",
            height: "100vh",
            easing: "linear",
            duration: 2000
        }, "-=4000");
}

export const showShopPage = (toggle) => {
    anime
        .timeline()
        .add({
            targets: "#background",
            opacity: 0,
            easing: "linear",
            duration: 2000,
            complete: () => {
                $("#background").attr("src", require("../assets/images/Shop_BG.jpg"));
                $("#background").css({
                    marginLeft: "0vw",
                    width: "100vw"
                });
            }
        })
        .add({
            targets: "#container",
            background: "#207067",
            easing: "linear",
            duration: 2000,
        }, "-=2000")
        .add({
            targets: "#background",
            opacity: 1,
            easing: "linear",
            duration: 2000
        })
        .add({
            targets: "#guide",
            left: "2vw",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#logo2",
            top: "2vh",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#close, #music, #shell",
            top: "4vh",
            easing: "easeOutQuint",
            duration: 2000
        }, "-=2000")
        .add({
            targets: "[data-name=posters]",
            scale: [0, 1],
            delay: anime.stagger(400),
            duration: 2000,
        }, "-=1200")
        .add({
            targets: "#posters-container",
            height: "72vh",
            easing: "linear",
            duration: 1200
        }, "-=4000")
        .add({
            targets: "#board10",
            scale: [0, 1],
            duration: 1000,
            begin: () => {
                if (!toggle)
                    $("#backdrop").toggle();
            }
        }, "-=4000");
}

export const showHomePage = () => {
    anime({
        targets: "#guide",
        left: "7vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#header",
        top: "2.25vh",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#shell, #shop, #avatar, #music, #logout",
        top: "1.75vh",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime
        .timeline()
        .add({
            targets: "#background",
            width: "180vw",
            height: "180vh",
            marginTop: "-20vh",
            marginLeft: "-20vw",
            opacity: 0.3,
            easing: "easeOutQuint",
            duration: 2000
        })
        .add({
            targets: "#module",
            scale: [0, 1],
            delay: anime.stagger(400),
            duration: 2000
        }, "-=1200");
}

export const showLogo = () => {
    anime({
        targets: "#logo-text",
        strokeDashoffset: [0, 500],
        easing: "linear",
        duration: 2000,
        direction: "alternate",
        loop: true
    });
    anime({
        targets: "#logo-text g",
        stroke: ["#7C382D", "#CEB891"],
        easing: "linear",
        duration: 2000,
        direction: "alternate",
        loop: true
    });
}