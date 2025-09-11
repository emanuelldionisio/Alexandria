

function getToken() {
    return localStorage.getItem('@alexandria:token');
}

function isAuthenticated() {
    if (getToken()) return true;
    window.location.href = '/login.html';
}

function getUserId() {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
}

function signin(token) {
    localStorage.setItem('@alexandria:token', token);
    window.location.href = '/inicial.html';
}

function signout() {
    localStorage.removeItem('@alexandria:token');
    window.location.href = '/login.html';
}

export default { isAuthenticated, getUserId, getToken, signin, signout }