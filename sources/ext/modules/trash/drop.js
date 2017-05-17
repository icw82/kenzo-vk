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

    if (kk.is_s(input)) {
        each (document.querySelectorAll(input), drop);
        return;
    }

    if (kk.is_NL(input)) {
        each (input, drop);
        return;
    }

    if (kk.is_N(input)) {
        drop(input);
    }
}
