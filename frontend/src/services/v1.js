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

export const terms = () => {
    return API.get(base + "/terms-conditions/");
}

export const privacy = () => {
    return API.get(base + "/privacy/");
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

export const score = (module, data) => {
    return API.post(base + `/score/${module}/`, data, {
        env: {
            noLoader: true
        }
    });
}