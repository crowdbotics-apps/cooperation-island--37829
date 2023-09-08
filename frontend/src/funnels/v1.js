import { getMonth, getYear } from "date-fns";

export const mapUserData = (data) => ({
    id: data.username,
    access: data.consent_status,
    active: true,
    age: data.age,
    avatar: data.avatar_id,
    details: data.detail_status,
    email: data.consent_email,
    shells: data.shells
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