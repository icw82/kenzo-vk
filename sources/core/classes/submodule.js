class SubModule {
    constructor (mod, name) {
        this.mod = mod;
        this.name = name;
        this.full_name = mod.full_name + ': ' + this.name;
        this.initiated = false;
        this.loaded = false;

        core.utils.local_console(this, this.full_name);
    }
}

core.SubModule = SubModule;
