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
        var info = new mod.Audio(element);

        if (!info.type) {
            mod.warn('no type');
            return;
        }

        mod.registry.list.push(info);
//        mod.log('new item in the list');

        mod.create_button(info);

        // Расширенная информация о файле
        info.enrich();

        // Профилактическая очистка списка
        mod.registry.list = mod.registry.list.filter(function(item) {
            return document.body.contains(item.dom.element);
        });
    });
}
