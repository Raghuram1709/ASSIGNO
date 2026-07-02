export const loadAuthToStorage = () => {

    try {

        const localToken =
            localStorage.getItem("token");

        const sessionToken =
            sessionStorage.getItem("token");

        const token =
            localToken || sessionToken;

        if (token) {

            return {
                token,
                isAuthenticated: true
            };
        }

    } catch (error) {
        console.error("Failed to load token:", error);
    }

    return {
        token: null,
        isAuthenticated: false
    };
};

export const saveAuthToStorage =
(token, rememberMe) => {

    if (rememberMe) {

        localStorage.setItem(
            "token",
            token
        );

    } else {

        sessionStorage.setItem(
            "token",
            token
        );
    }
};

export const clearAuthStorage = () => {

    localStorage.removeItem("token");

    sessionStorage.removeItem("token");
};

