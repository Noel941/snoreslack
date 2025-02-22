
// store data under key

export function saveToLocalStorage(key, value) {
    // check (if value is string and number) and (if not convert)
    if (typeof value === "string" || typeof value === "number") {
        localStorage.setItem(key, value);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
// retrieve value using keuy
// wrap parse in try-catch if stored data is not in correct format
export function getItemFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    if (value === null) {
        return null;
    }
    try {
        return JSON.parse(value);
    } catch (error) {
        console.error(`Error parsing ${key} from localstorage:`, error);
        return null;
    }
}

// retirieve tokens and user data 
// ensure all credentials are present

export const getStoredAuthDetails = () => {

    const accessToken = localStorage.getItem("access-token");
    const client = localStorage.getItem("client");
    const expiry = localStorage.getItem("expiry");
    const uid = localStorage.getItem("uid");
    const userInfoString = localStorage.getItem("user_info");

    if (!accessToken || !client || !expiry || !uid || !userInfoString) {
        console.error("Missing authentication details in localStorage.");
        return null;
    }

    try {
        const userInfo = JSON.parse(userInfoString);
        return {
            accessToken,
            client,
            expiry,
            uid,
            userInfo,
        };
    } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
        return null;
    }
};