class AudioRegistry extends Array {
    constructor () {
        super();
    }

    has (node) {
        return this.find(item => item.dom.element === node);
    }

    add (node) {
        if (kk.is.NL(node) || kk.is.A(node))
            return node.forEach(this.add.bind(this));

        if (!kk.is.E(node))
            throw TypeError();

        if (this.has(node))
            return;

        const audio_element = new mod.AudioElement(node, mod);

        if (audio_element.status) {
            this.push(audio_element);
        }
    }

    remove (item) {
        const index = this.findIndex(i => i === item);
        if (kk.is.n(index))
            this.splice(index, 1);
    }

    clean() {
        this.filter(item => !item.is_element_exist)
            .forEach(this.remove.bind(this));
    }
}
