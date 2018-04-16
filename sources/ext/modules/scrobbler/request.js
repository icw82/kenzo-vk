mod.request = (params, post) => new Promise((resolve, reject) => {
    if (!kk.is.o(params))
        params = {};

    if (!kk.is.s(params.method)) {
        mod.warn('Метод не задан');
        return;
    }

    const request = (url, params, post) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4 || xhr.status !== 200)
                return;

            if ('error' in xhr.response) {
                if (xhr.response.error == 9) {
                    // 9 : Invalid session key - Please re-authenticate
                    mod.storage.session = null;
//                    ext.save_storage('scrobbler/request');
                    mod.log('Сессия сброшена');
                    reject();
                } else {
//                    14 This token has not been authorized
                    mod.error(self.response);
                }
            } else {
                resolve(xhr.response);
            }
        }

        if (post)
            xhr.open('POST', url, true);
        else
            xhr.open('GET', url, true);

        xhr.responseType = 'json';

        if (post) {
            xhr.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(params);
        } else {
            xhr.send(null);
        }
    });

    params.api_key = mod.api_key;

    if (
        kk.is.o(mod.storage.session)
        && (mod.storage.session !== null)
        && ('key' in mod.storage.session)
    ) {
        params.sk = mod.storage.session.key;
    }

    params.api_sig = mod.get_signature(params);
    params.format = 'json';

    params = mod.encode_params(params);

    if (post) {
        request(mod.api_url, params, true).then(response => {
            resolve(response);
        }, reject);
    } else {
        request(mod.api_url + '?' + params, null).then(response => {
            resolve(response);
        }, reject);
    }
});

mod.encode_params = params => {
    const pairs = [];

    for (let key in params) {
        pairs.push(key + '=' + encodeURIComponent(params[key]));
    }

    return pairs.join('&');
}

//List of LAST FM API errors
//1 : This error does not exist
//2 : Invalid service -This service does not exist
//3 : Invalid Method - No method with that name in this package
//4 : Authentication Failed - You do not have permissions to access the service
//5 : Invalid format - This service doesn't exist in that format
//6 : Invalid parameters - Your request is missing a required parameter
//7 : Invalid resource specified
//8 : Operation failed - Most likely the backend service failed. Please try again.
//9 : Invalid session key - Please re-authenticate
//10 : Invalid API key - You must be granted a valid key by last.fm
//11 : Service Offline - This service is temporarily offline. Try again later.
//12 : Subscribers Only - This station is only available to paid last.fm subscribers
//13 : Invalid method signature supplied
//14 : Unauthorized Token - This token has not been authorized
//15 : This item is not available for streaming.
//16 : The service is temporarily unavailable, please try again.
//17 : Login: User requires to be logged in
//18 : Trial Expired - This user has no free radio plays left. Subscription required.
//19 : This error does not exist
//20 : Not Enough Content - There is not enough content to play this station
//21 : Not Enough Members - This group does not have enough members for radio
//22 : Not Enough Fans - This artist does not have enough fans for for radio
//23 : Not Enough Neighbours - There are not enough neighbours for radio
//24 : No Peak Radio - This user is not allowed to listen to radio during peak usage
//25 : Radio Not Found - Radio station not found
//26 : API Key Suspended - This application is not allowed to make requests to the web services
//27 : Deprecated - This type of request is no longer supported
//29 : Rate Limit Exceded - Your IP has made too many requests in a short period,
//     exceeding our API guidelines
