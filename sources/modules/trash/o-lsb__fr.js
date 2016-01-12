// Предложение друзей
mod.dom_observers.push({
    option_name: 'trash__lsb__fr',
    primary: function() {
        mod.drop('#left_friends');
    },
    for_observer: function(element) {
        if (element.getAttribute('id') == 'left_friends') {
            mod.drop(element);
        }
    }
});
