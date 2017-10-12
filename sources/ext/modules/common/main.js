mod.init__content = () => {
    core.events.on_content_loaded.addListener(() => {
        mod.ext.dom.header = document.body.querySelector('#page_header_cont');
        mod.ext.dom.content = document.body.querySelector('#page_body');
        mod.ext.dom.side_bar = document.body.querySelector('#side_bar');

        mod.ext.dom.overlay = document.createElement('div');
        mod.ext.dom.overlay.classList.add('kzvk-overlay');

        document.body.appendChild(mod.ext.dom.overlay);

        mod.on_loaded.dispatch();
    });
}

mod.init__background = () => {
    const github_api_url = 'https://api.github.com/repos/icw82/kenzo-vk/';
    const latest_release_url = github_api_url + 'releases/latest';
    const latest_commit_url = github_api_url + 'git/refs/heads/master';

    const github_raw_url = 'https://raw.githubusercontent.com/icw82/';
    const blacklist_url = github_raw_url + 'blacklist/master/blacklist.json';

//    core.utils.fetch_json(latest_release_url)
//        .then(json => {
//            mod.log('Последний релиз', json);
//        }, error => mod.error(error))

//    core.utils.fetch_json(latest_commit_url)
//        .then(json => {
//            mod.log('Последний коммит', json);
//        }, error => mod.error(error))

//    core.utils.fetch_json(blacklist_url, true)
//        .then(json => {
//            mod.log('Чёрный список', json);
//        }, error => mod.error(error))

}
