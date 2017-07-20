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

    console.log('>>>>>>>');

    {
        const xhr = new XMLHttpRequest();
        const url = 'https://raw.githubusercontent.com/icw82/blacklist/master/blacklist.json';
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200) {
                const data = JSON.parse(this.response);
                console.log(data);
            }
        }

        xhr.send(null);
    }

    mod.on_loaded.dispatch();

}
