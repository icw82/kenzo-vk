// Возможные друзья
const sub = new ext.SubModule(mod, 'potential_friends');

sub.init__content = () => {
    if (ext.mode === 2016) {
        ext.events.on_mutation.addListener(() => {
            if (ext.options.trash && ext.options.trash__potential_friends) {
                mod.drop('#friends_possible_block');
            }
        });
    }
}
