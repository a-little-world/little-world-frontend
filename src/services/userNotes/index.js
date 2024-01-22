import Cookie from "js-cookie";

import { BACKEND_URL } from "../../ENVIRONMENT";

export const getUserNotes = async () => {
    const response = await fetch(`${BACKEND_URL}/api/user-notes/`, {
        method: "GET",
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken"),
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-UseTagsOnly": true,
        },
    });
    const data = await response.json();
    return data;
};

export const addUserNote = async (note, source_language, target_language ) => {
    const response = await fetch(`${BACKEND_URL}/api/user-notes/`, {
        method: "POST",
        body: JSON.stringify({
            note_text: note,
            source_language: source_language,
            target_language: target_language,
        }),
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken"),
            "Content-Type": "application/json",
            "X-UseTagsOnly": true,
        },
    });
    const data = await response.json();
    return data;
};

export const noteStatusUpdate = async (bodyData) => {
    const response = await fetch(`${BACKEND_URL}/api/user-notes/`, {
        method: "PUT",
        body: JSON.stringify(bodyData),
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken"),
            "Content-Type": "application/json",
            "X-UseTagsOnly": true,
        },
    });
    const data = await response.json();
    return data;
};

export const deleteUserNote = async (id) => {
    const response = await fetch(`${BACKEND_URL}/api/user-notes/?note_id=${id}`, {
        method: "DELETE",
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken"),
            "Content-Type": "application/json",
            "X-UseTagsOnly": true,
        },
    });
    const data = await response.json();
    return data;
};