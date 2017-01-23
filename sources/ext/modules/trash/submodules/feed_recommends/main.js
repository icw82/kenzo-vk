sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.feed_since_photos) {
                //let area = ext.dom.content ? ext.dom.content : document;

                each ('.feed_since_photos', target => {
                    let block = kk.find_ancestor(target, '#feed_recommends');
                    sub.mod.drop(block);
                });
            }
        });
    }
}

//sub.init__background = () => {}
