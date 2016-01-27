mod.dom_observers.push({
    option_name: 'ui__ids',
    primary: function() {
        mod.user_id_after_name();
        ext.location.addEventListener('path', mod.user_id_after_name);
    }
});

// TODO: Кэширование
// FIX: Если обновить страницу средствами VK, url останется неизменным, но DOM обновится.
// FIX: два номера при переходе с удалённой странички на нормальную.

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
    var url = 'https://api.vk.com/method/utils.resolveScreenName?screen_name=' + page;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return false;
        if (xhr.status === 200) {
            var data = JSON.parse(this.response)

            if (data.error) {
                mod.warn(data);
                return;
            } else if (!data.response || !data.response.object_id) {
                mod.warn('нету');
                return;
            }

            var id = data.response.object_id;

            dom.id = document.createElement('span');
            dom.id.classList.add('kz-ui-id');
            if (data.response.type == 'user')
                dom.id.innerHTML = '<a href="/id' + id +'">' + id + '</a>';
            else if (data.response.type == 'group')
                dom.id.innerHTML = '<a href="/club' + id +'">' + id + '</a>';
            else
                warn('!!!!!!!!!!!!!!!!!', data.response.type)

            dom.title.appendChild(dom.id);
        }
    }
    xhr.send(null);
}
