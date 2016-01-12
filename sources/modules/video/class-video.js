// Класс видеозаписи
mod.Video = function(element, object) {
    this.available = false;
    this.formats = [];

    this.vid = null;
    this._title = null;
    Object.defineProperty(this, 'title', {
        get: function() {return this._title},
        set: function(new_value) {this._title = ext.name_filter(new_value)}
    });

    this.owner = null;
    this.owner_id = null;
    this.uid = null; // В чём отличие от OID?

    Object.defineProperty(this, 'id', {
        get: function() {this.owner_id + '_' + this.vid}
    });

    this.hash = null;
    this.hash2 = null;

    this.dom = {
        element: element
    }

    if (typeof object === 'undefined') {
        var data = element.getAttribute('flashvars');

        if (data) {
            (function(self) {
                self.available = true;
                data = data.split('&');
                each (data, function(item, index) {
                    var pair = item.split('='),
                        matches = pair[0].match(/url(\d+)/);

//                    mod.log('pair-' + index, pair);

                    if (matches) {
                        var format = new mod.Format(self);

                        format.format = parseInt(matches[1]);
                        format.url = decodeURIComponent(pair[1]);

                        self.formats.push(format);

                    } else if (pair[0] == 'md_author') {
                        self.owner = decodeURIComponent(pair[1])
                    } else if (pair[0] == 'md_title') {
                        self.title = decodeURIComponent(pair[1])
                    } else if (pair[0] == 'oid') {
                        self.owner_id = decodeURIComponent(pair[1])
                    } else if (pair[0] == 'uid') {
                        self.uid = decodeURIComponent(pair[1])
                    } else if (pair[0] == 'vid') {
                        self.vid = decodeURIComponent(pair[1])
                    } else if (pair[0] == 'hash') {
                        self.hash = decodeURIComponent(pair[1])
                    } else if (pair[0] == 'hash2') {
                        self.hash2 = decodeURIComponent(pair[1])
                    }
                });
            })(this);
        }
    } else if (typeof object.vid === 'number') {
        this.available = true;

        this.vid = object.vid;
        this.owner = object.md_author;
        this.owner_id = object.oid;
        this.uid = object.uid;
        this.title = object.md_title;

        this.hash = object.hash;
        this.hash2 = object.hash2;

        // Форматы
        for (var key in object) {
            let matches = key.match(/^url(\d{3,4})$/);

            if (matches) {
                var format = new mod.Format(this);

                format.format = parseInt(matches[1]);
                format.url = object[key];

                this.formats.push(format);
            }
        }
    }
}
