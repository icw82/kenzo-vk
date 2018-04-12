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

if (location.protocol === 'https:') {
    core.scope = 'content';
    core.s = 'cs';
} else if ([
    'chrome-extension:',
    'moz-extension:'
].includes(location.protocol)) {
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
    console.warn('Неизвестный протокол');
}

core.init = () => {

}
