mod.registry = (() => {
    const _ = {};
    let list = [];

    _.has = element => {
        return each (list, item => {
            if (item.dom.element === element)
                return item;
        });
    }

    _.update = input => {
        let collection;

        if (kk.is_E(input))
            collection = [input];
        else if (kk.is_NL(input))
            collection = input;

        each (collection, element => {
            if (_.has(element))
                return;

            if (element.classList.contains('kzvk-audio')) {
                mod.warn('Уже обработан');
                return;
            }

            let audio = new mod.Audio(element);
            list.push(audio);

//            mod.log(audio);
        });

        // Чистка
        list = list.filter(item => {
            return document.body.contains(item.dom.element);
        });
    }

    return _;
})();
