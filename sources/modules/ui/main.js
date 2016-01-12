var mod = new ext.Module('ui');

mod.dependencies = ['status'];

mod.default_options = {
    _: true,
    sidebar_button: false,
    ids: false
}

// Включение модуля
ext.modules[mod.name] = mod;

//TODO: Возраст, если известна дата.
