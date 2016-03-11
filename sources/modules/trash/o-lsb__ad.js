// Реклама в сайдбаре
mod.dom_observers.push({
    option_name: 'trash__lsb__ad',
    primary: function() {
        mod.drop('#ads_left');
        mod.drop('#left_ads');

        //FUTURE: #left_box #left_holiday
    },
    for_observer: function(element) {
        if (element.getAttribute('id') == 'ads_left')
            mod.drop(element);
        else if (element.getAttribute('id') == 'left_ads')
            mod.drop(element);
    }
});
