(function(kzvk){
'use strict';

var mod = new kzvk.Module('video');

mod.dependencies = ['provider'];

mod.default_options = {
    _: true,
    progress_bars: true,
    simplified: false,
    format_before_ext: true
}

mod.list = []; // NOTE: На данный момент используется единственный элемент.
mod.button_classes = [
    'kz-format',
    'kz-progress',
    'kz-unavailable'
]

// Класс видеозаписи
mod.Video = function() {
    this.available = false;
    this.formats = [];

    this.vid = null;
    this._title = null;
    Object.defineProperty(this, 'title', {
        get: () => {return this._title},
        set: (new_value) => {this._title = kzvk.name_filter(new_value)}
    });

    this.owner = null;
    this.owner_id = null;
    this.uid = null; // В чём отличие от OID?

    Object.defineProperty(this, 'id', {
        get: () => {this.owner_id + '_' + this.vid}
    });

    this.hash = null;
    this.hash2 = null;

    this.dom_element = null; // NOTE: Нужен ли передаваемый элемент?

    this.update = function() {
        // для ввода данных в объект
    }
}

// Класс формата
mod.Format = function(host) {
    if (host instanceof mod.Video)
        this.host = host;
    else
        throw Error('Unknown host');

    this.format = null;
    this._url = null;
    this.ext = null;
    Object.defineProperty(this, 'url', {
        get: () => {return this._url},
        set: (new_value) => {
            this._url = new_value;
            this.ext = new_value.match(/\.(\w+?)\?/)[1]
        }
    });

    Object.defineProperty(this, 'filename', {
        get: () => {
            var _ = this.host.title;
            if (mod.options.format_before_ext)
                _ += '.' + this.format;
            _ += '.' + this.ext;
            return _;
        }
    });
}

// TODO: Размер файла же + кэширование?
//FUTURE: (видео) Кнопки в мини-плеере;

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);
