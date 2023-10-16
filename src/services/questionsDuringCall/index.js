import Cookie from "js-cookie";

import { BACKEND_URL } from "../../ENVIRONMENT";

import React from 'react'

class QuestionsDuringCall {
    async getQuestions(){
        let response = await fetch(
            `${BACKEND_URL}/api/question/`,
            {
                method: "GET",
                headers: {
                    "X-CSRFToken": Cookie.get("csrftoken"),
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-UseTagsOnly": true,
                },
            }
        );
        let data = await response.text();
        data = JSON.parse(data);
        if(data.code === 200){
            return data.data
        }
        else return 
    }

    async archiveQuestion(id) {
        let response = await fetch(`${BACKEND_URL}/api/archived/`, {
            method: "POST",
            body: JSON.stringify({
                category_id: id,
            }),
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken"),
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-UseTagsOnly": true,
            },
        });
        if(response.status == 204){
            let data = await response.text();
            return data;
        }
        else{
            return 'error'
        }
    }
}

export const questionsDuringCall = new QuestionsDuringCall();