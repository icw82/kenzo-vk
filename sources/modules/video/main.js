var mod = new ext.Module('video');

mod.dependencies = ['provider'];

mod.default_options = {
    _: true,
    progress_bars: true,
    simplified: false,
    format_before_ext: true
}

mod.button_classes = [
    'kz-format',
    'kz-progress',
    'kz-unavailable'
]

// TODO: to kk
mod.create_proxy = function(object, property, callback) {
    if (typeof property !== 'string') return;

    var proxy_property = '_' + property;

    object[proxy_property] = void(0);

    Object.defineProperty(object, property, {
        get: function() {return object[proxy_property]},
        set: function(new_value) {
            object[proxy_property] = new_value;
            callback(object, property);
        }
    });
}

// TODO: Размер файла же + кэширование?
//FUTURE: (видео) Кнопки в мини-плеере;

// Включение модуля
ext.modules[mod.name] = mod;
