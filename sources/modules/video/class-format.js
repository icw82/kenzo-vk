// Класс формата
mod.Format = function(host) {
    if (host instanceof mod.Video)
        this.host = host;
    else
        throw Error('Unknown host');

    this.dom = {};
    this.format = null;
    this._url = null;
    this.ext = null;
    Object.defineProperty(this, 'url', {
        get: function() {return this._url},
        set: function(new_value) {
            this._url = new_value;
            this.ext = new_value.match(/\.(\w+?)\?/)[1]
        }
    });

    Object.defineProperty(this, 'filename', {
        get: function() {
            var _ = this.host.title;
            if (mod.options.format_before_ext)
                _ += '.' + this.format;
            _ += '.' + this.ext;
            return _;
        }
    });

    Object.defineProperty(this, 'url_clean', {
        get: function() {
            if (typeof this.url == 'string') {
                return this.url.replace(/^(.+?)\?.*/, '$1');
            }
        }
    });

    // клон из Аудио
    this.view = (function(self){
        var _ = {
            first_query: false,
            last_query: false
        }

        _.goal = function() {
            if (_.first_query === false) {
                _.first_query = setTimeout(_.update, 100);
                _.last_query = setTimeout(_.update, 10);
            } else {
                clearInterval(_.last_query);
                _.last_query = setTimeout(_.update, 10);
            }
        }

        _.update = function(){
            clearInterval(_.first_query);
            _.first_query = false;
            clearInterval(_.last_query);
            _.last_query = false;

            mod.update_button(self);
        }

        return _;
    })(this);

    mod.create_proxy(this.dom, 'wrapper', this.view.goal);
    mod.create_proxy(this.dom, 'carousel', this.view.goal);
    mod.create_proxy(this, 'format', this.view.goal);
    mod.create_proxy(this, 'error', this.view.goal);

    mod.create_proxy(this, 'progress', mod.update_button__download_progress);

}
