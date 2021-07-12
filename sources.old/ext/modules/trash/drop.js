mod.drop = (input, option) => {
    const drop = node => {
        if (mod.dom.trash_bin.contains(node))
            return;
        mod.dom.trash_bin.appendChild(node);
        if ('style' in node)
            node.style.height = '0px';
        else
            console.warn('>>>>', node);
        mod.log('drop', node);
    }

    if (kk.is.s(input)) {
        each (document.querySelectorAll(input), drop);
        return;
    }

    if (kk.is.NL(input)) {
        each (input, drop);
        return;
    }

    if (kk.is.N(input)) {
        drop(input);
    }
}
