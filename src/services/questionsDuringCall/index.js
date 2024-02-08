import Cookie from 'js-cookie';
import React from 'react';

import { BACKEND_URL } from '../../ENVIRONMENT';

class QuestionsDuringCall {
  async getQuestions(archived = true) {
    let response = await fetch(
      `${BACKEND_URL}/api/user/question_cards/?archived=${archived}&category=all`,
      {
        method: 'GET',
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-UseTagsOnly': true,
        },
      },
    );
    let data = await response.json();
    return data;
  }

  async archieveQuestion(uuid, archive = true) {
    let response = await fetch(`${BACKEND_URL}/api/user/archive_card/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-UseTagsOnly': true,
      },
      body: JSON.stringify({ uuid, archive }),
    });
    let data = await response.json();
    return data;
  }
}

export const questionsDuringCall = new QuestionsDuringCall();
