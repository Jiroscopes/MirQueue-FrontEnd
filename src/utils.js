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

    if (data.status === 'success') {
        return true;
    }

    return false;
}

export function validString(str) {
    return !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(str);
}
