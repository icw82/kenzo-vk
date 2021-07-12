mod.destroy = (input, option) => {
    var _ = node => {
        node.parentElement.removeChild(node);
        mod.log('destroy', node);
    }

    if (typeof input == 'string') {
        each (document.querySelectorAll(input), _);
    } else if (input instanceof NodeList) {
        each (input, _);
    } else if (input instanceof Node) {
        _(input);
    }
}
