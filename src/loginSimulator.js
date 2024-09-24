const baseUrl = 'http://localhost:3333';
const baseLogin = {
  username: 'tim+docs@little-world.com',
  password: "I'dLikeToViewTheDocs!",
};

// eslint-disable-next-line import/prefer-default-export
export function simulatedAutoLogin(
  username = baseLogin.username,
  password = baseLogin.password,
) {
  return fetch(`${baseUrl}/api/devlogin/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      dev_dataset: 'main_frontend',
    }),
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Reponse not ok');
  });
}
