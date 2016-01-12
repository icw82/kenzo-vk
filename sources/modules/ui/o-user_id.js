mod.dom_observers.push({
    option_name: 'ui__ids',
    primary: function() {
        mod.user_id_after_name();
        ext.location.addEventListener('path', mod.user_id_after_name);
    }
});

// TODO: Кэширование
// FIX: Если обновить страницу средствами VK, url останется неизменным, но DOM обновится.

mod.user_id_after_name = function() {
    var dom = {
        title: document.querySelector('#header #title')
    }

    var ignore = [
        '/feed',
        '/im',
        '/friends',
        '/video',
        '/groups',
        '/search',
        '/settings',
        '/apps',
        '/fave',
        '/docs'
    ];

    if (!dom.title) return;
    if (ignore.indexOf(window.location.pathname) > -1) return;
    if (each ([
        /\/photo(-?\d+_\d+)/,
        /\/audios(-?\d+)/,
        /\/albums(-?\d+)/,
        /\/album(-?\d+_\d+)/,
        /\/video(-?\d)/,
        /\/app(\d+_\d+)/
    ], function(regexp){
        if (regexp.test(window.location.pathname))
            return true;
    })) return;

    var page = window.location.pathname.match(/\/(.+)/)[1];

    var xhr = new XMLHttpRequest();
    var url = 'https://api.vk.com/method/users.get?user_ids=' + page;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return false;
        if (xhr.status === 200) {
            var data = JSON.parse(this.response)

            if (data.error) {
                mod.log(data);
                return;
            }

            var id = data.response[0].uid;

            dom.id = document.createElement('span');
            dom.id.classList.add('kz-ui-id');
            dom.id.innerHTML = '<a href="/id' + id +'">' + id + '</a>';

            dom.title.appendChild(dom.id);
        }
    }
    xhr.send(null);
}
