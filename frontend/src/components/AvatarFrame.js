import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import anime from "animejs";
import clsx from "clsx";

const useStyles = makeStyles({
    avatar: {
        width: "14vw"
    },
    avatar_1: {
        transform: "scaleX(-1)",
        marginTop: "3vh",
        marginLeft: "0.4vw"
    },
    avatar_2: {
        transform: "scaleX(-1)",
        marginTop: "4vh",
        marginLeft: "0.4vw"
    },
    avatar_3: {
        transform: "scaleX(-1)",
        marginTop: "5vh",
        marginLeft: "0.4vw"
    },
    avatar_4: {
        transform: "scaleX(-1)",
        marginTop: "4vh",
        marginLeft: "0.6vw"
    },
    avatar_5: {
        transform: "scaleX(-1)",
        marginTop: "4vh",
        marginLeft: "0.2vw"
    },
    avatar_6: {
        marginTop: "2vh",
        marginLeft: "1vw"
    },
    avatar_7: {
        marginTop: "4vh",
        marginLeft: "0.1vw"
    },
    avatar_8: {
        marginTop: "3vh",
        marginLeft: "-0.4vw"
    },
    avatar_9: {
        marginTop: "5vh",
        marginLeft: "0.1vw"
    },
    avatar_10: {
        marginTop: "5vh",
        marginLeft: "0.1vw"
    },
    container: {
        position: "absolute",
        overflow: "hidden",
        height: "24.3vh",
        width: "14vw",
        top: "0vh"
    },
    frame: {
        width: "16vw"
    },
    root: {
        position: "relative",
        transform: "scale(0)"
    },
    shadow: {
        position: "absolute",
        rotate: "52deg",
        zIndex: -1,
        width: "24vw",
        top: "2vh",
        left: "-14vw"
    },
    worm: {
        position: "absolute",
        width: "4vw"
    },
    variant1: {
        top: "-0.5vh",
        left: "-0.5vw",
        rotate: "-45deg"
    },
    variant2: {
        top: "-2.2vh",
        left: "5.6vw"
    },
    variant3: {
        top: "-0.6vh",
        left: "11vw",
        rotate: "20deg"
    },
});

const AvatarFrame = (props) => {
    const cls = useStyles();

    const avatarId = "avatar" + props.avatar;

    useEffect(() => {
        anime({
            targets: `#${avatarId} path`,
            fill: (e) => {
                if (e.id === "path-light")
                    return props.active ? "#3F8477" : "#B76400";
                else if (e.id === "path-normal")
                    return props.active ? "#215851" : "#8E430C";
                else if (e.id === "path-dark")
                    return props.active ? "#18443E" : "#7C382D";
            },
            easing: "linear",
            duration: 250
        });
        anime({
            targets: `#${avatarId} ~ .${cls.shadow}`,
            opacity: props.active ? 1 : 0,
            easing: "linear",
            duration: 250
        });
        if (props.active)
            anime({
                targets: `#frame[prefix="${avatarId}"]`,
                scale: [0.9, 1],
                duration: 250
            });
    }, [props.active]);

    return <div className={clsx(cls.root, props.className)} id="frame" prefix={avatarId} onClick={props.onClick}>
        <svg className={clsx(cls.frame, "pointer")} id={avatarId} viewBox="0 0 308 245">
            <path opacity="0.2" d="M35.8729 198.984C41.1761 223.501 69.1978 242.042 103.845 241.94C138.492 241.832 213.853 240.914 249.991 234.307C286.144 227.701 299.813 205.116 303.155 179.945C306.505 154.779 310.435 77.0756 304.154 51.0523C297.874 25.029 275.648 11.5043 239.326 8.01818C202.997 4.526 152.837 -0.430242 112.96 1.20784C58.327 3.45195 31.1573 25.8631 30.7827 58.8227C30.4815 84.99 31.0545 176.608 35.8729 198.984Z" fill="black" />
            <path d="M14.9832 198.984C20.2221 223.501 47.9497 242.042 82.2241 241.94C116.498 241.832 191.042 240.914 226.798 234.307C262.562 227.701 276.085 205.116 279.391 179.945C282.704 154.779 286.599 77.0756 280.379 51.0523C274.166 25.029 252.179 11.5043 216.248 8.01818C180.31 4.526 130.682 -0.430242 91.2341 1.20784C37.1958 3.45195 10.3256 25.8631 9.94774 58.8227C9.65709 84.99 10.2166 176.608 14.9832 198.984Z" fill="#7C382D" id="path-dark" />
            <path d="M6.10592 201.96C11.4093 226.477 39.4317 245.018 74.0797 244.916C108.728 244.808 184.084 243.89 220.23 237.283C256.391 230.671 270.053 208.098 273.396 182.927C276.745 157.761 280.675 80.0515 274.395 54.0283C268.114 28.005 245.887 14.4863 209.565 10.9941C173.234 7.50195 123.073 2.54571 83.1879 4.18379C28.568 6.4339 1.39755 28.839 1.02294 61.7986C0.721782 87.9659 1.29472 179.584 6.10592 201.96Z" fill="#8E430C" id="path-normal" />
            <path d="M5.12597 194.374C2.15588 171.636 -1.04658 105.623 2.55528 77.5065C10.3835 16.4898 117.67 28.9017 172.083 55.9993C249.806 94.7085 251.759 225.364 204.528 237.382C177.616 244.222 108.2 245.228 77.0834 244.846C45.9665 244.476 10.1802 232.962 5.12597 194.374Z" fill="#B76400" id="path-light" />
            <path d="M15.3307 196.748C20.159 219.146 45.7002 236.078 77.2787 235.988C108.843 235.892 177.517 235.052 210.458 229.01C243.407 222.974 255.862 202.346 258.903 179.355C261.951 156.363 265.533 85.3718 259.811 61.6001C254.089 37.8284 233.838 25.4745 200.735 22.2826C167.633 19.0966 121.906 14.5607 85.58 16.0607C35.7944 18.1126 14.3196 42.7303 13.9752 72.8439C13.6895 96.7656 10.9346 176.307 15.3307 196.748Z" fill="#7C382D" id="path-dark" />
            <path d="M28.2725 182.182C34.7046 216.891 61.6775 227.06 93.5545 227.06C122.994 227.06 177.347 226.165 208.053 220.464C238.773 214.751 250.386 195.235 253.216 173.488C256.061 151.741 259.401 84.5829 254.067 62.0922C248.734 39.6015 229.845 27.9148 198.987 24.904C168.121 21.8931 125.497 17.6006 91.6191 19.0213C45.2042 20.9621 22.1241 40.321 21.8112 68.8152C21.5493 91.4208 23.8413 158.27 28.2725 182.182Z" fill="#E9C56B" />
            <path d="M37.7915 186.105C42.0042 206.082 64.3102 221.193 91.8821 221.108C119.447 221.017 179.414 220.269 208.169 214.886C236.94 209.503 247.82 191.105 250.472 170.6C253.13 150.088 256.268 86.7779 251.271 65.5672C246.273 44.3627 228.594 33.3533 199.686 30.5037C170.777 27.6603 130.858 23.6199 99.131 24.9565C55.6667 26.7854 34.0435 45.0431 33.7457 71.8921C33.506 93.2243 33.9636 167.872 37.7915 186.105Z" fill="#EDDBAD" />
            <path d="M21.7978 49.1298C21.3612 63.3295 42.007 64.1705 51.4601 51.3496C61.3636 37.9223 44.7445 27.4928 37.4329 31.5204" fill="#7C382D" id="path-dark" />
            <path d="M76.606 39.5728C66.2396 39.5465 67.5458 30.3732 77.4414 27.9484C87.3523 25.5288 93.7164 39.6201 76.606 39.5728Z" fill="#8E430C" id="path-normal" />
            <path d="M66.8364 51.4458C68.5061 46.5092 74.475 48.2004 75.3132 53.3983C76.1582 58.5961 64.0851 59.5821 66.8364 51.4458Z" fill="#8E430C" id="path-normal" />
            <path d="M43.085 48.5695C28.7322 57.1829 20.2835 44.7177 27.2455 36.3466C39.7398 21.3116 57.7523 39.7789 43.085 48.5695Z" fill="#8E430C" id="path-normal" />
            <path d="M252.75 185.325C248.078 197.621 237.47 189.417 239.23 175.732C240.99 162.052 254.572 163.656 256.891 166.502" fill="#7C382D" id="path-dark" />
            <path d="M156.854 8.21364C141.871 7.0686 131.312 2.63307 153.775 4.18792C176.239 5.73674 203.09 8.07503 223.353 11.0762C243.615 14.0775 271.646 26.5403 274.006 67.8461C276.358 109.152 272.617 165.084 269.56 167.483C266.503 169.881 271.805 96.8217 266.525 69.2081C260.929 39.9072 245.263 21.3937 218.728 16.3374C192.186 11.2691 165.68 8.88258 156.854 8.21364Z" fill="#B76400" id="path-light" />
        </svg>
        <svg className={clsx(cls.worm, cls[`variant${props.variant}`], "pointer")} viewBox="0 0 74 38">
            <path d="M18.7489 17.2301C24.2182 20.2115 32.8592 -0.339056 46.481 0.00425575C60.0907 0.353591 61.9962 14.0379 63.0333 20.5488C64.0705 27.0536 72.8984 24.1264 73.3024 30.8963C73.6944 37.6662 66.3498 40.762 57.5098 34.2331C48.5372 27.6198 53.729 17.0916 46.2217 15.0317C37.8942 12.7429 35.03 32.2334 17.3017 29.8363C2.61262 27.8427 11.5009 13.279 18.7489 17.2301Z" fill="#B1B233" />
            <path d="M28.1773 11.0625C25.1562 15.2244 27.3813 22.0846 32.7842 17.1818C38.1991 12.2731 42.3116 7.82207 48.0582 9.89398C53.7988 11.9719 58.3876 6.83429 54.0641 2.88921C49.7466 -1.04984 37.4273 -1.67021 28.1773 11.0625Z" fill="#B1B233" />
            <path d="M3.90315 13.2669C10.4035 5.79833 24.5439 9.21338 24.1399 22.2351C23.6816 37.1602 -9.29655 28.4087 3.90315 13.2669Z" fill="#B1B233" />
            <path d="M5.61059 13.3813C8.99945 8.21353 21.2705 9.84577 19.8776 18.5912C18.2435 28.7882 -1.37217 24.0721 5.61059 13.3813Z" fill="#C9CF3B" />
            <path d="M24.5515 14.1102C27.2348 11.3697 34.5251 15.3088 30.3463 20.1151C26.1736 24.9155 20.1375 18.6274 24.5515 14.1102Z" fill="#C9CF3B" />
            <path d="M31.305 6.94277C34.6154 3.87706 40.8625 8.4425 37.8536 12.8514C34.8627 17.2602 26.8066 11.1167 31.305 6.94277Z" fill="#C9CF3B" />
            <path d="M41.1256 0.757012C46.7215 -1.74254 50.1103 5.53327 44.2793 7.98464C39.196 10.1228 36.2654 2.9253 41.1256 0.757012Z" fill="#C9CF3B" />
            <path d="M51.0121 2.45558C55.402 0.0644402 59.6712 6.40066 56.3668 9.50251C53.0563 12.5983 45.8444 5.27435 51.0121 2.45558Z" fill="#C9CF3B" />
            <path d="M57.5215 14.2306C62.056 12.8874 63.0088 18.4467 59.1134 19.9585C55.23 21.4702 53.5417 15.4171 57.5215 14.2306Z" fill="#C9CF3B" />
            <path d="M62.1255 26.4031C63.7958 23.0483 68.656 25.6261 67.2751 28.5112C65.8942 31.4022 60.3466 29.9808 62.1255 26.4031Z" fill="#C9CF3B" />
            <path d="M7.41228 16.0013C6.03744 15.64 4.0415 17.995 5.38017 19.3622C6.72486 20.7354 8.79918 16.3507 7.41228 16.0013Z" fill="#543615" />
            <path d="M15.8453 17.7479C17.196 18.2358 17.4975 21.3015 15.6162 21.6629C13.7288 22.0363 14.5247 17.2601 15.8453 17.7479Z" fill="#543615" />
        </svg>
        <svg className={cls.shadow} viewBox="0 0 670 601">
            <g filter="url(#filter0_f_382_265)">
                <g clipPath="url(#clip0_382_265)">
                    <g filter="url(#filter1_dd_382_265)">
                        <circle cx="357" cy="244" r="157" fill="#F8F8F8" />
                    </g>
                    <g opacity="0.8" filter="url(#filter2_f_382_265)">
                        <ellipse cx="155.166" cy="153.239" rx="155.166" ry="153.239" transform="matrix(-0.288205 -0.957569 0.936518 -0.35062 254.352 352.88)" fill="#FFE073" />
                    </g>
                    <g opacity="0.8" filter="url(#filter3_f_382_265)">
                        <ellipse cx="131.665" cy="127.538" rx="131.665" ry="127.538" transform="matrix(-0.482888 -0.875682 0.798496 -0.602 237.129 377.583)" fill="#FFC700" />
                    </g>
                    <g opacity="0.8" filter="url(#filter4_f_382_265)">
                        <path d="M509.384 21.507C579.172 78.5824 526.023 365.966 499.035 347.08C482.571 335.559 463.107 238.103 411.425 196.338C378.387 169.64 319.237 189.122 281.563 191.877C184.956 198.942 439.015 -36.0445 509.384 21.507Z" fill="#FF5C00" />
                    </g>
                </g>
            </g>
            <defs>
                <filter id="filter0_f_382_265" x="0" y="-113" width="714" height="714" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_382_265" />
                </filter>
                <filter id="filter1_dd_382_265" x="188" y="77" width="338" height="338" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="6" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.6875 0 0 0 0 0.744318 0 0 0 0 1 0 0 0 0.06 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_382_265" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.549757 0 0 0 0 0.610463 0 0 0 0 0.929167 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_382_265" result="effect2_dropShadow_382_265" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_382_265" result="shape" />
                </filter>
                <filter id="filter2_f_382_265" x="178.785" y="-31.4721" width="348.715" height="364.082" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="12" result="effect1_foregroundBlur_382_265" />
                </filter>
                <filter id="filter3_f_382_265" x="131.316" y="22.9717" width="288.145" height="325.072" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="12" result="effect1_foregroundBlur_382_265" />
                </filter>
                <filter id="filter4_f_382_265" x="235.924" y="-11.5777" width="331.994" height="383.547" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="12" result="effect1_foregroundBlur_382_265" />
                </filter>
                <clipPath id="clip0_382_265">
                    <rect x="200" y="87" width="314" height="314" rx="100" fill="white" />
                </clipPath>
            </defs>
        </svg>
        <div className={clsx(cls.container, "pointer")}>
            <img className={clsx(cls.avatar, cls[`avatar_${props.avatar}`], "pointer")} src={require(`../assets/avatars/xs/Avatar_${props.avatar}.png`)} />
        </div>
    </div>

}

export default AvatarFrame;