// Рекомендуемые сообщества
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.group_recom) {
                let area = ext.dom.content ? ext.dom.content : document;

                each (area.querySelectorAll('#ads_ads_news_wrap'), target => {
                    let block = kk.find_ancestor(target, '.feed_row');
                    sub.mod.drop(block);
                });
            }
        });
    }
}
