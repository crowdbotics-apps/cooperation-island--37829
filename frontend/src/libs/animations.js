import anime from "animejs";
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
        left: "6vw",
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
        left: "3vw",
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
        left: "2.5vw",
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
        left: "6vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime
        .timeline()
        .add({
            targets: "#board5",
            top: "10vh",
            easing: "easeOutQuint",
            duration: 2000
        })
        .add({
            targets: "#animal2",
            top: "1vh",
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
        left: "6vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime
        .timeline()
        .add({
            targets: "#board",
            left: "60vw",
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

export const showAvatarPage = () => {
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
            targets: "#logout, #music",
            left: "94vw",
            easing: "easeOutQuint",
            duration: 2000,
            complete: () => {
                $("#logout, #music").css("position", "sticky");
            }
        }, "-=2000")
        .add({
            targets: "#frame",
            scale: [0, 1],
            delay: (_, i) => i % 5 * 300,
            duration: 2000
        }, "-=2000")
        .add({
            targets: "#avatar-page",
            height: "100vh",
            easing: "linear",
            duration: 2000
        }, "-=4000");
}

export const showHomePage = () => {
    anime({
        targets: "#guide",
        left: "6vw",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#header",
        top: "4vh",
        easing: "easeOutQuint",
        duration: 2000
    });
    anime({
        targets: "#logout, #music",
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