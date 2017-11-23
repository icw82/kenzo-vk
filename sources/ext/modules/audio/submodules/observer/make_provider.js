sub.make_provider = key => {
    const script_element = document.createElement('script');

//    kk.r.addEventListener('message', event => {
//        if (event.origin == 'https://vk.com') {
//
//            console.log(event);
//        }
//    });

    // Объект, передаваемый в формате JSON изолированной функции
    const properties = {
        id: browser.runtime.id,
        actions: sub.actions,
        key: key
    }

    script_element.innerHTML =
        `(${ sub.isolated_function })(${ JSON.stringify(properties) })`;

    core.events.on_content_loaded.addListener(() => {
        document.body.appendChild(script_element);
    });
}
