const core = {
    utils: {},
    events: {},
    events_key: kk.generate_key(10),
    scopes: ['content', 'background']
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
