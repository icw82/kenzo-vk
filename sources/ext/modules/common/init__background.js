mod.init__background = () => {

//    const github_api_url = 'https://api.github.com/repos/icw82/kenzo-vk/';
//    const latest_release_url = github_api_url + 'releases/latest';
//    const latest_commit_url = github_api_url + 'git/refs/heads/master';
//
//    Promise.all([
//        core.utils.fetch_json(latest_release_url),
//        core.utils.fetch_json(latest_commit_url)
//    ]).then(results => {
//        const [latest_release, latest_commit] = [...results];
//
//        mod.log('Последний релиз', latest_release);
//        mod.log('Последний коммит', latest_commit);
//
//
//    }, error => mod.error(error));

    mod.on_loaded.dispatch();
}
