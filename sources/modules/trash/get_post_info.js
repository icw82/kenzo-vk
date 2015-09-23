(function(kzvk){
'use strict';

var mod = kzvk.modules.trash;

function parse(matches) {
    var _ = {};

    _.author_id = matches[1];
    _.post_id = matches[2];

    if (_.author_id[0] === '-'){
        _.author_id = _.author_id.slice(1);
        _.is_group = true;
    } else {
        _.is_group = false;
    }

    return _;
}

mod.get_post_info = function(element){

    if (!(element instanceof Element) || !element.classList.contains('post')) {
        kzvk.options.debug__log &&
            mod.warn('Не пост', element);
        return false;
    }

    var element_id = element.getAttribute('id');
    var matches = element_id.match(/^post(.+?)_(.+)/);

    var _ = parse(matches);

    var copy = element.getAttribute('data-copy');

    if (copy){
        _.is_repost = true;

        matches = copy.match(/(.+?)_(.+)/);

        _.repost = parse(matches);
    } else {
        _.is_repost = false;
    }

    _.element = element;

    return _;
}

})(kzvk);
