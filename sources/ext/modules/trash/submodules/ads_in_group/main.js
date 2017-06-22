sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.ads_in_group) {
                //let area = ext.dom.content ? ext.dom.content : document;

                each ('.wall_module .wall_marked_as_ads', target => {
                    let block = kk.find_ancestor(target, 'page_block');

                    if (block.classList.contains('post'))
                        sub.mod.drop(block);
                });
            }
        });
    }
}

//sub.init__background = () => {}
