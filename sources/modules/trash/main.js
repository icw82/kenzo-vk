var mod = new ext.Module('trash');

mod.default_options = {
    _: true,
    self: true,
    lsb__ad: true,
    lsb__fr: true,
    group_recom: true,
    newsads: true,
    promoted_posts: false,
    profile_rate: true,
    big_like: false,
    user_reposts: false,
    group_reposts: false
}

mod.observers = []; // FUTURE: В правильно ли место определения свойства?

// Включение модуля
ext.modules[mod.name] = mod;

//FUTURE: Удалать шары групп и прочего;
//FUTURE: Удалять шары групп, в которых я и так состою;
//TODO: Индикация удалённых репостов (количество);
//NOTE: Нужно ли делать искустенную прокурутку для удаления всех репостов ленты?;
