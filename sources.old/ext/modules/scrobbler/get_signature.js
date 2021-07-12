mod.get_signature = params => {
    const keys = [];
    let string = '';

    for (let key in params) {
        keys.push(key);
    }

    keys.sort();

    each (keys, key => {
        string += key + params[key];
    });

    string += mod.secret;

    return md5(string);
}
