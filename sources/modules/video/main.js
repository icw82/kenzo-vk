var mod = new ext.Module('video');

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
        get: function() {return this._title},
        set: function(new_value) {this._title = ext.name_filter(new_value)}
    });

    this.owner = null;
    this.owner_id = null;
    this.uid = null; // В чём отличие от OID?

    Object.defineProperty(this, 'id', {
        get: function() {this.owner_id + '_' + this.vid}
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
        get: function() {return this._url},
        set: function(new_value) {
            this._url = new_value;
            this.ext = new_value.match(/\.(\w+?)\?/)[1]
        }
    });

    Object.defineProperty(this, 'filename', {
        get: function() {
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
ext.modules[mod.name] = mod;
