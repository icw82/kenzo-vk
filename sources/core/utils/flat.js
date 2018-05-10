core.utils.object_to_flat = object => {
    const list = {};
    const flat = (source, prefix) => {
        for (let key in source) {
            let path = '';

            if (kk.is.s(prefix))
                path += prefix + '.' + key;
            else
                path += key;

            if (
                kk.is.o(source[key])
                && !kk.is.A(source[key])
                && (source[key] !== null)
                && Object.keys(source[key]).length > 0
            ) {
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

        // test.testico = null

        each (splited_path, (key, i) => {
            if (i < splited_path.length - 1) {
                // Путь
                if (!kk.is.o(current[key]) || current[key] === null) {
                    current[key] = {};
                }

                current = current[key];
            } else {
                // Конечное значение
                if (current === null)
                    current = {};

                current[key] = flat[path];
            }
        });
    }

    return object;
}
