import { useEffect } from "react";

const aspectRatio = parseFloat(window.innerWidth / window.innerHeight).toFixed(2) > 2.13;

const IFrame = () => {
    useEffect(() => {
        window.addEventListener("resize", () => {
            window.location.reload();
        });
    }, []);

    return <div
        style={{
            alignItems: "center",
            background: "#000000",
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            width: "100vw"
        }}>
        <iframe
            style={{
                height: aspectRatio ? window.innerHeight : window.innerWidth / 2.13,
                width: aspectRatio ? window.innerHeight * 2.13 : window.innerWidth
            }}
            src={process.env.PUBLIC_URL + location.pathname}
        />
    </div>
}

export default IFrame;