import { getMonth, getYear } from "date-fns";

export const mapUserData = (data) => ({
    id: data.username,
    access: data.consent_status,
    active: true,
    age: data.age,
    avatar: data.avatar_id,
    details: data.detail_status,
    email: data.consent_email,
    shells: data.shells,
    posters: data.themes
});

export const mapUserDetails = (data) => ({
    birth_month: getMonth(data.birthDay) + 1,
    birth_year: getYear(data.birthDay),
    gender: data.gender,
    nationality: data.nationality,
    zipcode: data.zipcode
});

export const mapFeedback = (data) => {
    return data
        .filter(x => parseInt(x.question_type) === 1 || parseInt(x.question_type) === 4 || x.options.length === 2 || x.options.length === 4)
        .map(x => ({
            id: x.id,
            question: x.question_text,
            question_type: parseInt(x.question_type),
            options: x.options
        }));
}

export const mapPrompt = (data) => {
    return data
        .map(x => ({
            id: x.id,
            prompt: x.prompt_text
        }));
}

export const mapPosters = (data) => {
    return data
        .sort((x, y) => x.price - y.price)
        .map((x, i) => ({
            id: x.id,
            name: x.name,
            description: x.description,
            shells: x.price,
            variant: [1, 3, 8].includes(i) ? 2 : [0, 5, 7].includes(i) ? 1 : 0
        }));
}