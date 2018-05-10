sub.get_url = async id => {
    try {
        const data = await sub.cache.get(id);

        const age = kk.ts() - data.ts;

        if (age < sub.expiration) {
            return data.url;
        } else {
            const exists = await core.utils.is_url_exists(data.url);
            if (exists)
                return data.url;
            else
                return await refresh_url(id);
        }

    } catch(error) {
        return await refresh_url(id)
    }
}

const refresh_url = async id => {
    try {
        const url = await sub.UrlsFromHost.get(id);

        sub.cache.put({
            id: id,
            url: url,
            ts: kk.ts()
        });

        return url;

    } catch(error) {
        throw error;
    }
}
