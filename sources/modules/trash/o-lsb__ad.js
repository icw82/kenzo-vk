// Реклама в сайдбаре
mod.dom_observers.push({
    option_name: 'trash__lsb__ad',
    primary: function() {
        mod.drop('#left_ads');

        //FUTURE: #left_box #left_holiday
    },
    for_observer: function(element) {
        if (element.getAttribute('id') == 'left_ads') {
            mod.drop(element);
        }
    }
});
