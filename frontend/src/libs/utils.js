import { useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import anime from "animejs";

anime.suspendWhenDocumentHidden = false;

export { anime };

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
    email: false,
    shells: 0,
    posters: []
};

export const postersData = Array(9).fill()
    .map((_, i) => ({
        id: i + 1,
        name: "",
        description: "",
        shells: "",
        variant: [1, 3, 8].includes(i) ? 2 : [0, 5, 7].includes(i) ? 1 : 0
    }));

export const rankedQualities = [
    {
        id: 1,
        desc: "like being equal with things between yourself and someone else",
        text: "Being Fair"
    },
    {
        id: 2,
        desc: "like telling the truth",
        text: "Being Honest"
    },
    {
        id: 3,
        desc: "like doing what instructions say",
        text: "Following the rules"
    },
    {
        id: 4,
        desc: "like being giving and kind towards others",
        text: "Being Generous"
    },
    {
        id: 5,
        desc: "like making people laugh",
        text: "Being funny"
    },
    {
        id: 6,
        desc: "like being good at sport",
        text: "Being athletic"
    },
    {
        id: 7,
        desc: "like being good at painting and drawing",
        text: "Being artistic"
    },
    {
        id: 8,
        desc: "like being good at learning and understanding things",
        text: "Being intelligent"
    },
    {
        id: 9,
        desc: "like saying it’s ok if someone does something wrong to you",
        text: "Being forgiving"
    },
    {
        id: 10,
        desc: "like not staying quiet if you see someone being mean",
        text: "Standing up for others"
    },
    {
        id: 11,
        desc: "like being reliable, or doing what you said you’d do",
        text: "Being trustworthy"
    }
];

export const shuffleArray = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
}

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


export const tempData = [
    {
        id: 1,
        name: "Surf's Up!",
        description: "Surf's Up!",
        shells: 8,
        variant: 1
    },
    {
        id: 2,
        name: "Ancient Ruins",
        description: "Ancient Ruins",
        shells: 11,
        variant: 2
    },
    {
        id: 3,
        name: "Pirate Adventure",
        description: "Pirate Adventure",
        shells: 47
    },
    {
        id: 4,
        name: "Aqua Adventure",
        description: "Aqua Adventure",
        shells: 69,
        variant: 2
    },
    {
        id: 5,
        name: "Moonlit Campfire",
        description: "Moonlit Campfire",
        shells: 78
    },
    {
        id: 6,
        name: "Mystical Enchantment",
        description: "Mystical Enchantment",
        shells: 305,
        variant: 1
    },
    {
        id: 7,
        name: "Tropical Paradise",
        description: "Tropical Paradise",
        shells: 902
    },
    {
        id: 8,
        name: "Jungle Explorer",
        description: "Jungle Explorer",
        shells: 4811,
        variant: 1
    },
    {
        id: 9,
        name: "Celestial Voyager",
        description: "Celestial Voyager",
        shells: 68212,
        variant: 2
    }
];