// Рекомендуемые сообщества
const sub = new ext.SubModule(mod, 'group_recom');

sub.init__content = () => {
    if (ext.mode === 2016) {
        ext.events.on_mutation.addListener(() => {
            if (ext.options.trash__group_recom) {
                let area = ext.dom.content ? ext.dom.content : document;

                each (area.querySelectorAll('#group_recom_wrap'), target => {
                    let block = kk.find_ancestor(target, '.page_block');
                    mod.drop(block);
                });
            }
        });
    }
}
