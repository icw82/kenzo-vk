/* Говнокод */
sub.decodeURL = source => {
    const map =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=';

    const transforms = {
        v: function (t) {
//                console.log('V');
            return t.split('').reverse().join('')
        },
        r: function (t, e) {
//                console.log('R');
            t = t.split("");
            for (var i, n = r + r, o = t.length; o--;) ~(i = n.indexOf(t[o])) && (t[o] = n.substr(i - e, 1));
            return t.join("")
            },
        s: (t, e) => {
//                console.log('S');
            var i = t.length;
            if (i) {
                var r = function (t, e) {
                        var i = t.length,
                            r = [];

                        if (i) {
                            var n = i;
                            for (e = Math.abs(e); n--;) e = (i * (n + 1) ^ e + n) % i, r[n] = e
                        }
                        return r
                    }(t, e),
                    n = 0;
                for (t = t.split(""); ++n < i;) t[n] = t.splice(r[i - 1 - n], 1, t[n])[0];
                t = t.join("")
            }
            return t
        },
        i: function (t, e) {
            return transforms.s(t, e ^ mod.ext.host_data.vk.id)
        },
        x: function (t, e) {
//                console.log('X');
            var i = [];
            return e = e.charCodeAt(0), each(t.split(''), function (t, o) {
                i.push(String.fromCharCode(o.charCodeAt(0) ^ e))
            }), i.join('')
        }
    }

    {
        let extra = source.split('?extra=')[1].split('#');
        let ugliness = '' === extra[1] ? '' : hut(extra[1]);

        extra = hut(extra[0]);

        if (typeof ugliness != 'string' || !extra)
            return source;

        ugliness = ugliness ? ugliness.split(String.fromCharCode(9)) : [];

        for (let s, r, n = ugliness.length; n--;) {
            r = ugliness[n].split(String.fromCharCode(11));
            s = r.splice(0, 1, extra)[0];
            if (!transforms[s])
                return source;
            extra = transforms[s].apply(null, r)
        }

        if (extra && 'http' === extra.substr(0, 4))
            return extra
    }

    function hut(kusok) {
        if (!kusok || kusok.length % 4 == 1)
            return !1;
        for (var e, i, o = 0, a = 0, s = ''; i = kusok.charAt(a++);) {
            i = map.indexOf(i);
            ~i &&
            (e = o % 4 ? 64 * e + i : i, o++ % 4) &&
            (s += String.fromCharCode(255 & e >> (-2 * o & 6)));
        }
        return s
    }

    function hueta(string, number) {
        const size = string.length;
        const array = [];

        // e — number
        // a — count
        // i — size
        // o — array

        if (size) {
            let count = size;
            for (number = Math.abs(number); count--;) {
                    number = (size * (count + 1) ^ number + count) % size,
                    array[count] = number
            }
        }
        return array
    }
}
