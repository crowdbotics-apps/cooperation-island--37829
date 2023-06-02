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
    return API.patch(base + "/users/update_avatar_id/", { avatar_id: id });
}