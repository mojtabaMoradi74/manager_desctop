import { useState, useEffect, useRef } from "react";

import { useDispatch } from "react-redux";

import { replaceNewRefreshToken } from "../app/modules/auth/redux/AuthCRUD";

const useIsMainWindow = () => {

    const initialized = useRef(false);

    const isNewWindowPromotedToMain = useRef(false);

    const windowId = useRef(null);

    const [isMain, setIsMain] = useState(true);

    const dispatch = useDispatch();


    /**
     * get all opened window from localStorage
     * @returns 
     */
    const getWindowArray = () => {
        let storage = window.localStorage.getItem("APP_INSTANCE");
        return storage ? JSON.parse(storage) : [];
    };

    /**
     * set all active window in localStorage
     * @param {*} data 
     */
    const setWindowArray = (data) => {
        window.localStorage.setItem("APP_INSTANCE", JSON.stringify(data));
    };

    /**
     * determine the current Window State
     */
    const determineWindowState = () => {
        let windowArray = getWindowArray();

        if (initialized.current) {
            if (windowArray.length <= 1 || windowArray.pop() === windowId.current) {
                setIsMain(true);
            } else setIsMain(false);
        } else {

            setIsMain(true);

            const newWindowArray = [...windowArray, windowId.current];

            setWindowArray(newWindowArray);
        }
    };

    /**
     * remove window if deactivated
     */
    const removeWindow = () => {
        var newWindowArray = getWindowArray();
        for (var i = 0, length = newWindowArray.length; i < length; i++) {
            if (newWindowArray[i] === windowId.current) {
                newWindowArray.splice(i, 1);
                break;
            }
        }
        setWindowArray(newWindowArray);
    };

    useEffect(() => {

        window.addEventListener("beforeunload", removeWindow);

        window.addEventListener("unload", removeWindow);

        isNewWindowPromotedToMain.current = true;

        windowId.current = Date.now().toString();

        determineWindowState();

        initialized.current = true;

        window.addEventListener("storage", (event) => {
            if (event.key === "APP_INSTANCE") determineWindowState();

            // set new data in app state
            if (event.key === "persist:volex-game") {

                let data = JSON.parse(event.newValue, (key, value) => {
                    if (["accessToken", "refreshToken", "accessTokenExpire", "refreshTokenExpire"].includes(key)) {
                        let res = JSON.parse(value);

                        return res
                    } else return value;
                });

                dispatch(replaceNewRefreshToken({
                    accessToken:data?.data.accessToken.token
                    ,refreshToken:data?.data.refreshToken.token
                    ,accessTokenExpire:data?.data.accessToken.expiresAt
                    ,refreshTokenExpire:data?.data.refreshToken.expiresAt
                  }))
            }
        })

        return () => {

            window.removeEventListener("beforeunload", removeWindow);

            window.removeEventListener("unload", removeWindow);

            window.removeEventListener("storage", () => { });

        };
    }, []);

    return isMain;
};

export default useIsMainWindow;