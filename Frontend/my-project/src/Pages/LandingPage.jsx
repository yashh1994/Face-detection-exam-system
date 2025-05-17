import { useEffect } from "react";

const LANDER_URL = "https://example.com"; // Use full URL here

const LandingPage = () => {
    useEffect(() => {
        window.location.replace(LANDER_URL);
    }, []);

    return null;
};

export default LandingPage;
