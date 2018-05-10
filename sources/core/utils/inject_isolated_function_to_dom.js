// Встраивание в DOM мгновенно выполняемой функции в контексте страницы
core.utils.inject_isolated_function_to_dom = (isolated_function, args) => {
    const element = document.createElement('script');

    element.innerHTML =
        `(${ isolated_function })(${ JSON.stringify(args) });`;

    // FUTURE: возможно ли сократить время до выполнения скрипта на странице?
    core.events.on_content_loaded.addListener(() => {
        document.body.appendChild(element);
    });
}
