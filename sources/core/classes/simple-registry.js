//simple-registry.js

class SimpleRegistry {
    constructor() {
        const self = this;

        self.list = [];

//        Object.defineProperty(this, 'list', {
//            get: () => list
//        });

    }

    has (element) {
        const self = this;

        return each (self.list, item => {
            if (item === element)
                return item;
        });
    }

    add (element) {
        const self = this;

        const registered = self.has(element);

        if (registered) {
            return;
        } else {
            self.list.push(element);
            return element;
        }
    }
}

core.SimpleRegistry = SimpleRegistry;
