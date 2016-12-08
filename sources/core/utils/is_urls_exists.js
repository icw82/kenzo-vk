core.utils.is_urls_exists = urls => new Promise((resolve, reject) => {
    if (!kk.is_A(urls)) {
        reject();
        return;
    }

    const results = {
        exists: [],
        not_exists: []
    }

    const part_complete = new kk.Event();

    const next_part = () => {
        if (urls.length === 0) {
            resolve(results);
            part_complete.removeListener(next_part);
            return;
        }

        let part = urls.splice(0, 20);

        const remove = url => {
            part.splice(part.indexOf(url), 1);
            if (part.length === 0) {
                part_complete.dispatch();
            }
        }

        each (part, url => {
            core.utils.is_url_exists(url).then(() => {
                results.exists.push(url);
                remove(url);
            }, () => {
                results.not_exists.push(url);
                remove(url);
            });
        });
    }

    part_complete.addListener(next_part);

    next_part();

});
