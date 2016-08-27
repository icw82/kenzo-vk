// Инициирование модулей
function init__modules() {

    // FUTURE: Проверка на ацикличность графа зависимостей

    for (var key in ext.modules) {
        if (!(ext.modules[key] instanceof ext.Module)) continue;

        ext.modules[key].init();
    }

    // FUTURE: Promise.chain([ [*, *], [*, *], * ]);
}
