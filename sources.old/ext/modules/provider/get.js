mod.get = async path => {
    const id = kk.generate_key(15);
    const ts = Date.now();
    let response;

    const request = {
        key: mod.key,
        id: id,
        ts: ts,
        from: 'cs',
        to: 'page',
        method: 'get',
        args: [path]
    }

    if (mod.onTransceiverInit.state.completed) {
        window.postMessage(request, window.location.origin);
    } else {
        mod.onTransceiverInit.addListener(() => {
            window.postMessage(request, window.location.origin)
        });
    }

    return await new Promise((resolve, reject) => {
        const handler = response => {
            if (response.id === request.id) {
                mod.onMessageFromPage.removeListener(handler);
                resolve(response.response);
            }
        }

        mod.onMessageFromPage.addListener(handler);
    });
}
