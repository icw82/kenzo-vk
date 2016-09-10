core.utils.object_to_flat = object => {
    const list = {};
    const flat = (source, prefix) => {
        for (let key in source) {
            let path = '';

            if (kk.is_s(prefix))
                path += prefix + '.' + key;
            else
                path += key;

            if (kk.is_o(source[key]) && !kk.is_A(source[key])) {
                flat(source[key], path)
            } else {
                list[path] = source[key];
            }
        }
    }

    flat(object);

    return list;
}

core.utils.flat_to_object = flat => {
    const object = {};

    for (let path in flat) {
        const splited_path = path.split('.');
        let current = object;

        each (splited_path, (key, i) => {
            if (i < splited_path.length - 1) {
                if (!kk.is_o(current[key])) {
                    current[key] = {};
                }

                current = current[key];
            } else {
                current[key] = flat[path];
            }
        });
    }

    return object;
}
