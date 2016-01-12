mod.registry = {
    list: []
}

mod.registry.add = function(element) {
    if (!(element instanceof Element)) {
        mod.warn('registry.add: DOM-элемент не передан');
        return;
    }

    each (mod.registry.list, function (item) {
        // Отлов дублей
        if (item.dom.element === element) {
            mod.warn('Отлов дублей, йоу');
            //return true;
        }

    }, function () {
        var info;

        ext.modules.provider.get('videoview.getPlayerObject()').then(function(response) {
            if (response.meta.is_element === true)
                info = new mod.Video(element);
            else if (typeof response.value.vars === 'object')
                info = new mod.Video(element, response.value.vars);
            else
                mod.log('Видеоплеер не обнаружен');

            if (info) {
                mod.registry.list.push(info);
                mod.create_buttons(info);
            }

            // Профилактическая очистка списка
            mod.registry.list = mod.registry.list.filter(function(item) {
                return document.body.contains(item.dom.element);
            });

        }, function(response) {
            mod.warn('registry.add error', response);
        });
    });
}
