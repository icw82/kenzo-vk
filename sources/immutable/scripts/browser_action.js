(function() {

var tabs = [];

each ('.b-tabs', function(element) {
    let name = element.getAttribute('data-name');

    if (!name) return;


    let tab = each (tabs, function(tab) {
        if (tab.name === name)
            return tab;
    }, function() {
        let tab = {
            name: name,
            anchors: [],
            items: []
        }

        tabs.push(tab);

        return tab;
    });

    each (element.querySelectorAll('.b-tabs__anchor'), function(anchor) {
        tab.anchors.push(anchor);
    });

    each (element.querySelectorAll('.b-tabs__item'), function(item) {
        tab.items.push(item)
    });

});

each (tabs, function(tab) {
    let number = Math.min(tab.anchors.length, tab.items.length);
    let current = 0;

    each (tab.anchors, function(anchor, i) {
        anchor.addEventListener('click', function() {
            set(i);
        });
    });

    set(current);

    function set (index) {
        each (tab.anchors, function(anchor, i) {
            if (i === index)
                anchor.classList.add('current');
            else
                anchor.classList.remove('current');
        });

        each (tab.items, function(item, i) {
            if (i === index)
                item.classList.add('current');
            else
                item.classList.remove('current');
        });
    }

});

})();
