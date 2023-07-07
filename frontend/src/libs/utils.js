import { useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";

export const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

export const userState = {
    id: "",
    access: false,
    active: false,
    age: 0,
    avatar: 0,
    details: false,
    email: false
};

export const rankedQualities = [
    "Being Honest",
    "Being Funny",
    "Being Stickler",
    "Being Fair",
    "Being Athletic",
    "Being Generous",
    "Being Intelligent",
    "Being Artistic"
];

export const formatAge = (value, initial) => {
    if (value === "" || value && /[0-9]/.test(value))
        return value;
    else
        return initial;
}

export const formatCode = (value, initial) => {
    if (/[^a-zA-Z0-9]/.test(value))
        return initial;
    else
        return value.toUpperCase();
}

export const formatText = (value, initial) => {
    if (/[^a-zA-Z]/.test(value))
        return initial;
    else
        return value;
}

export const formatUsername = (value, initial) => {
    if (/[^a-zA-Z0-9_]/.test(value))
        return initial;
    else
        return value.toUpperCase();
}

export const formatZipCode = (value, initial) => {
    if (/[^0-9-]/.test(value))
        return initial;
    else
        return value.toUpperCase();
}

export const parseToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (_) {
        return "";
    }
}

export const validateEmail = (value) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
}

export const validateZipCode = (value) => {
    return /^[0-9]{5}(?:-[0-9]{4})?$/.test(value);
}