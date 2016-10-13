const core = {
    utils: {},
    events: {},
    storage: {
        defaults: {},
        map: {},
        data: {}
    },
    events_key: kk.generate_key(10),
    scopes: ['content', 'background']
}

// Определение контекста
if (location.protocol === 'chrome-extension:') {
    if (location.pathname === '/_generated_background_page.html') {
        core.scope = 'background';
        core.s = 'bg';
    } else if (location.pathname === '/layouts/options.html') {
        core.scope = 'options';
        core.s = 'opt';
    } else if (location.pathname === '/layouts/browser_action.html') {
        core.scope = 'browser_action';
        core.s = 'act';
    }
} else {
    core.scope = 'content';
    core.s = 'cs';
}

core.init = () => {

}
