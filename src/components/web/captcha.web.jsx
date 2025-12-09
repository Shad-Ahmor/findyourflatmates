// src/screens/captcha.web.jsx
import { useRef, useState, useEffect } from 'react';
import { Platform, View, Text } from 'react-native';

// ⚠️ IMPORTANT: USE YOUR REAL reCAPTCHA V2 INVISIBLE SITE KEY HERE
const RECAPTCHA_SITE_KEY = "6Ld8YCUsAAAAAB1X7HA8xskQVlHLPF_Pe4l6rbuh";
const RECAPTCHA_SCRIPT_ID = "recaptcha-script";

export const useRecaptcha = () => {
    const recaptchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    // -------------------------------
    // 1. Load reCAPTCHA script
    // -------------------------------
    useEffect(() => {
        if (Platform.OS !== "web") return;

        // If script already exists, mark as loaded
        if (document.getElementById(RECAPTCHA_SCRIPT_ID)) {
            setIsScriptLoaded(true);
            return;
        }

        window.onRecaptchaLoad = () => {
            console.log("reCAPTCHA script loaded.");
            setIsScriptLoaded(true);
        };

        const script = document.createElement("script");
        script.id = RECAPTCHA_SCRIPT_ID;
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            delete window.onRecaptchaLoad;
        };
    }, []);

    // -------------------------------
    // 2. Manual rendering of invisible reCAPTCHA widget
    // -------------------------------
    useEffect(() => {
        if (
            isScriptLoaded &&
            recaptchaRef.current &&
            typeof grecaptcha !== "undefined" &&
            recaptchaRef.current.children.length === 0
        ) {
            grecaptcha.ready(() => {
                const widgetId = grecaptcha.render(recaptchaRef.current, {
                    sitekey: RECAPTCHA_SITE_KEY,
                    size: "invisible"
                });

                widgetIdRef.current = widgetId;
                console.log("Invisible reCAPTCHA rendered. Widget ID:", widgetId);
                setIsRecaptchaReady(true);
            });
        }
    }, [isScriptLoaded]);

    // -------------------------------
    // 3. Execute reCAPTCHA (returns token)
    // -------------------------------
    const executeRecaptcha = async () => {
        const TIMEOUT_MS = 7000;

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("reCAPTCHA timed out."));
            }, TIMEOUT_MS);

            if (!isRecaptchaReady || widgetIdRef.current == null) {
                clearTimeout(timeout);
                return reject(
                    new Error("reCAPTCHA widget not ready. Try again.")
                );
            }

            grecaptcha.ready(() => {
                grecaptcha
                    .execute(widgetIdRef.current, { action: "login" }) // IMPORTANT FIX
                    .then((token) => {
                        clearTimeout(timeout);
                        if (!token || token.length === 0)
                            return reject(
                                new Error(
                                    "reCAPTCHA token empty. Site key or domain not verified."
                                )
                            );
                        resolve(token);
                    })
                    .catch((err) => {
                        clearTimeout(timeout);
                        reject(
                            new Error(`reCAPTCHA execution failed: ${err.message}`)
                        );
                    });
            });
        });
    };

    return {
        recaptchaContainerRef: recaptchaRef,
        executeRecaptcha,
        isRecaptchaReady,
    };
};

// -------------------------------
// 4. UI Component for badge
// -------------------------------
export const RecaptchaContainer = ({ recaptchaContainerRef, styles }) => (
    <View style={styles.recaptchaContainer}>
        <View ref={recaptchaContainerRef} />
        <Text style={styles.recaptchaBadgeText}>
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </Text>
    </View>
);

export default useRecaptcha;
