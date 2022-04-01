// Send request to backend
export async function addItemToQueue(uri) {
  const url = `${process.env.REACT_APP_API_URL}/add-song`;
  const { authToken, refreshToken } = JSON.parse(
    localStorage.getItem('user')
  ).tokens;

  const postBody = {
    uri,
    tokens: {
      authToken,
      refreshToken,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  });

  const data = await response.json();

  console.log(data);
}

export async function isSession(sessionCode) {
  const url = `${process.env.REACT_APP_API_URL}/check-session`;

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: sessionCode }),
  });

  const data = await response.json();

  // console.log(data);

  if (data.status === 'success') {
    return true;
  }

  return false;
}

export async function checkGuestName(name) {
  const url = `${process.env.REACT_APP_API_URL}/guest-user`;

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  return data;
}

export function validString(str) {
  return !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(str);
}
