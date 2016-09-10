// Возможные друзья
sub.init__content = () => {
    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (mod.options.trash__potential_friends) {
                mod.drop('#friends_possible_block');
            }
        });
    }
}
