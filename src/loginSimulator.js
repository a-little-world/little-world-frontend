const baseUrl = "localhost:3333";
const baseLogin = {
  username: "test1@user.de",
  password: "Test123!",
};

// eslint-disable-next-line import/prefer-default-export
export function simulatedAutoLogin(username = baseLogin.username, password = baseLogin.passoword) {
  return fetch(`${baseUrl}/api/devlogin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      dev_dataset: "main_frontend",
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
