mod.dom_observers.push({
    option_name: 'trash__big_like',
    primary: function() {
        mod.drop('.pvs_hh');
    },
    for_observer: function(element) {
        mod.drop(element.querySelectorAll('.pvs_hh'));
    }
});
