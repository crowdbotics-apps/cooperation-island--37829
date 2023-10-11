import API from "../libs/api";

const base = "/v1";

export const login = (data) => {
    return API.post(base + "/login/", data);
}

export const signup = (data) => {
    return API.post(base + "/signup/", data);
}

export const access = (code) => {
    return API.get(base + "/access-code/", {
        params: {
            access_code: code
        }
    });
}

export const details = (data) => {
    return API.post(base + "/details/", data);
}

export const avatar = (id) => {
    return API.patch(base + "/users/update_avatar_id/", {
        avatar_id: id
    });
}

export const refresh = () => {
    return API.get(base + "/refresh/", {
        env: {
            noLoader: true
        }
    });
}

export const resetPassword = (id) => {
    return API.post(base + "/reset-password/", {
        username: id
    });
}

export const getUsername = (sessionId) => {
    return API.get(base + `/reset-password/${sessionId}/`);
}

export const savePassword = (sessionId, password) => {
    return API.post(base + `/reset-password/${sessionId}/`, {
        new_password: password
    });
}

export const email = (resend = false) => {
    return API.post(base + "/email/", {
        resend_email: resend
    });
}

export const consent = () => {
    return API.get(base + "/consent/");
}

export const assent = () => {
    return API.get(base + "/assent/");
}

export const feedback = (module) => {
    return API.get(base + `/feedback/${module}/`, {
        env: {
            noLoader: true
        }
    });
}

export const saveFeedback = (module, data) => {
    return API.post(base + `/feedback/${module}/`, data, {
        env: {
            noLoader: true
        }
    });
}

export const prompt = (module) => {
    return API.get(base + `/prompt/${module}/`, {
        env: {
            noLoader: true
        }
    });
}

export const sendPrompt = (module, data) => {
    return API.post(base + `/prompt/${module}/`, data, {
        env: {
            noLoader: true
        }
    });
}

export const score = (module, data) => {
    return API.post(base + `/score/${module}/`, data, {
        env: {
            noLoader: true
        }
    });
}

export const qualities = (data) => {
    return API.post(base + "/qualities/voice-your-values/", data);
}

export const moduleData = (module) => {
    return API.get(base + `/data/${module}/`, {
        env: {
            noLoader: true
        }
    });
}

export const buyPoster = (data) => {
    return API.post(base + "/theme/buy/", data);
}

export const openPoster = (id) => {
    return API.get(base + "/theme/details/", {
        env: {
            noLoader: true
        },
        params: {
            theme_id: id
        }
    });
}

export const sendPoster = (id) => {
    return API.post(base + `/print/${id}/`);
}