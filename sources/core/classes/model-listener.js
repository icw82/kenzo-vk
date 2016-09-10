class ModelListener {
    constructor(scope, callback) {
        this.callback = callback;
        this.scope = scope;
        this.first_query = false;
        this.last_query = false;
    }

    goal() {
        let update = this.update.bind(this);

        if (this.first_query === false) {
            this.first_query = setTimeout(update, 100);
            this.last_query = setTimeout(update, 10);
        } else {
            clearInterval(this.last_query);
            this.last_query = setTimeout(update, 10);
        }
    }

    update() {
        clearInterval(this.first_query);
        this.first_query = false;
        clearInterval(this.last_query);
        this.last_query = false;

        this.callback(this.scope);
    }

}

core.ModelListener = ModelListener;
