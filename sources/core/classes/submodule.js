class SubModule {
    constructor (name, mod) {
        this.mod = mod;
        this.name = name;
        this.full_name = mod.full_name + '.' + this.name;
        this.initiated = false;
        this.loaded = false;

        core.utils.local_console(this, this.full_name);
    }

    init () {
        const self = this;
        const init = this['init__' + core.scope];

        if (!kk.is_f(init))
            return;

        init();
    }
}

core.SubModule = SubModule;
