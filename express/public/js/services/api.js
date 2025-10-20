import Auth from '../lib/auth.js'

const domain = '/api';

async function create(resource, data, auth=true) {
    const url = `${domain}${resource}`;

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    if (auth) {
        config.headers.Authorization = `Bearer ${Auth.getToken()}`;
    }

    const res = await fetch(url, config);

    if (res.status == 401) {
        Auth.signout();
    }

    return res.json();
}

async function read(resource, auth = true) {
    const url = `${domain}${resource}`;

    const config = {
        method: 'GET',
        headers: {}
    };

    if (auth) {
        config.headers.Authorization = `Bearer ${Auth.getToken()}`;
    }

    const res = await fetch(url, config);

    if (res.status == 401) {
        Auth.signout();
    }

    return res.json();
}


async function update(resource, data, auth = true) {
    const url = `${domain}${resource}`;

    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    if (auth) {
        config.headers.Authorization = `Bearer ${Auth.getToken()}`;
    }

    const res = await fetch(url, config);

    if (res.status == 401) {
        Auth.signout();
    }

    return res.json();

}

async function remove(resource, data, auth = true) {
    const url = `${domain}${resource}`;

    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    if (auth) {
        config.headers.Authorization = `Bearer ${Auth.getToken()}`;
    }

    const res = await fetch(url, config);

    if (res.status == 401) {
        Auth.signout();
    }

}

export default { create, read, update, remove };