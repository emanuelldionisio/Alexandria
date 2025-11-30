import Auth from '../lib/auth.js'

const domain = '/api';

async function create(resource, data, auth=true, formData=false) {
    const url = `${domain}${resource}`;

    const config = {
        method: 'POST',
        body: formData ? data : JSON.stringify(data),
        headers: {},
    };

    if (!formData) {
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }


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


async function update(resource, data, auth = true, formData = false) {
    const url = `${domain}${resource}`;

    const config = {
        method: 'PUT',
        body: formData ? data : JSON.stringify(data),
        headers: {
            Authorization: `Bearer ${Auth.getToken()}`,
        },
    };

    if (!formData) {
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }


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