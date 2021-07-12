// Возможные друзья
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.potential_friends) {
                sub.mod.drop('#friends_possible_block');

//            feed_friends_recomm
                each (`#feed_wall .feed_friends_recomm`, element => {
                    const block = kk.find_ancestor(element, '.feed_row');
                    sub.mod.drop(block);
                });
            }
        });
    }
}
