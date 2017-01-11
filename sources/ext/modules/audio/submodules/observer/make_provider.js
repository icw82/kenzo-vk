sub.make_provider = key => {
    const provider = document.createElement('script');

    // Объект, передаваемый в формате JSON изолированной функции
    const properties = {
        id: browser.runtime.id,
        actions: sub.actions,
        key: key
    }

//    kk.r.addEventListener('message', event => {
//        if (event.origin == 'https://vk.com') {
//
//            console.log(event);
//        }
//    });

    provider.innerHTML = '(' + sub.isolated_function + ')(' + JSON.stringify(properties) + ')';

    core.events.on_content_loaded.addListener(() => {
        document.body.appendChild(provider);
    });
}
