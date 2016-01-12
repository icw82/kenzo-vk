// Популярные сообщества
mod.dom_observers.push({
    option_name: 'trash__group_recom',
    primary: function() {
        mod.drop('#group_recom_wrap');
    },
    for_observer: function(element) {
        if (element.getAttribute('id') !== 'wrap2') return false;
        mod.drop(element.querySelector('#group_recom_wrap'));
    }
});
