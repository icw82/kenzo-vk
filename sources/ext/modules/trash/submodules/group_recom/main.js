// Рекомендуемые сообщества
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.group_recom) {
                let area = ext.dom.content ? ext.dom.content : document;

                each (area.querySelectorAll('#group_recom_wrap'), target => {
                    let block = kk.find_ancestor(target, '.page_block');
                    mod.drop(block);
                });
            }
        });
    }
}
