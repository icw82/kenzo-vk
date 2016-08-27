const core = {
    utils: {},
    events: {}
}

// Определение контекста
if (location.protocol === 'chrome-extension:') {
    if (location.pathname === '/_generated_background_page.html') {
        core.scope = 'background';
        core.s = 'bg';
    } else {
        // TODO: Для страницы настроек?
    }
} else {
    core.scope = 'content';
    core.s = 'cs';
}
