import { getMonth, getYear } from "date-fns";

export const mapUserData = (data) => ({
    id: data.username,
    access: data.consent_status,
    active: true,
    age: data.age,
    avatar: data.avatar_id,
    details: data.detail_status,
    email: data.consent_email
});

export const mapUserDetails = (data) => ({
    birth_month: getMonth(data.birthDay) + 1,
    birth_year: getYear(data.birthDay),
    gender: data.gender,
    nationality: data.nationality,
    zipcode: data.zipcode
});