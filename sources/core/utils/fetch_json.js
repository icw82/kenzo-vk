core.utils.fetch_json = (
    url,
    force = false
) => new Promise((resolve, reject) => {
    const request = new Request(url);

    return fetch(request)
        .then(response => {
            if (force)
                return response.json();

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json'))
                return response.json();

            throw new TypeError('fetch_json: Не JSON ' + url);
        })
        .then(json => resolve(json))
        .catch(error => reject(error));
});
