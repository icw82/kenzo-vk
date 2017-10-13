// 132 (длина описания)

//"browser_action": {
//    "default_icon": {
//        "19": "images/icons/19.png",
//        "38": "images/icons/38.png"
//    },
//    "default_popup": "layouts/browser_action.html"
//},

//    browser.tabs.query({url: [
//        "*://vk.com/*",
//        "*://*.vk.com/*",
//        "*://*.vk.me/*"
//    ]}, function(tabs) { console.log(tabs)})


//    var url = 'https://api.vk.com/method/groups.getMembers?group_id=70770587';

//    var graph_of_dependencies = {
//        vertices: [],// вершины
//        edges: [] // дуги
//    }
//
//    for (let module_name in ext.modules) {
//        // Классический граф
//        graph_of_dependencies.vertices.push(module_name)
//
//        each (ext.modules[module_name].dependencies, function(adjacent) {
//            graph_of_dependencies.edges.push([module_name, adjacent]);
//        });
//    }
//
//    //console.log('--- graph_of_dependencies', graph_of_dependencies);
//
//    // 1. Выделить компоненты связности
//    var connected_components = find_connected_components(graph_of_dependencies);
//
//    function find_connected_components(graph) {
//        var connected_components = [];
//        var discovered_total = [];
//
//        function DFS(graph, vertex) {
//            var discovered = [];
//
//            function inner_function(graph, vertex) {
//                // Пометить данную вершину как исследованную
//                discovered.push(vertex);
//
//                each (graph.edges, function(edge) {
//                    // Для всех рёбер, идущих от данной вершины к смежной вершине
//                    if (edge[0] === vertex)
//                        // Если смежная вершина не исследована
//                        if (discovered.indexOf(edge[1]) === -1)
//                            inner_function(graph, edge[1]);
//                });
//            }
//
//            inner_function(graph, vertex);
//
//            return discovered;
//        }
//
//        each (graph.vertices, function(vertex) {
//            if (discovered_total.indexOf(vertex) === -1) {
//                var vertices_of_connected_component = DFS(graph, vertex);
//                var edges_of_connected_component = []
//                each (graph.edges, function(edge) {
//                    if (vertices_of_connected_component.indexOf(edge[0]) >= 0)
//                        edges_of_connected_component.push(edge);
//                });
//
//                connected_components.push([
//                    vertices_of_connected_component,
//                    edges_of_connected_component
//                ]);
//
//                discovered_total.concat(vertices_of_connected_component);
//            }
//        });
//
//        return connected_components;
//    }
//
//    //console.log('--- connected_components', connected_components);
//
//    // 2. Инвертирование ориентации рёбер (как бы имеется ввиду, но не производится),
//    //    топологическая сортировка каждой компоненты свзяности
//    //    и поранговый запуск.

//    calc_mp3_bitrate_classic(size, duration) {
//        var kbps = Math.floor(size * 8 / duration / 1000);
//
//        if ((kbps >= 288)) kbps = 320; else
//        if ((kbps >= 224) && (kbps < 288)) kbps = 256; else
//        if ((kbps >= 176) && (kbps < 224)) kbps = 192; else
//        if ((kbps >= 144) && (kbps < 176)) kbps = 160; else
//        if ((kbps >= 112) && (kbps < 144)) kbps = 128; else
//        if ((kbps >= 80 ) && (kbps < 112)) kbps = 96; else
//        if ((kbps >= 48 ) && (kbps < 80 )) kbps = 64; else
//        if ((kbps >= 20 ) && (kbps < 48 )) kbps = 32;
//
//        return kbps;
//    }
const test_urls = [
    'https://vk.com/mp3/audio_api_unavailable.mp3?extra=Ac85Cc4Zyt1zmwrUuw92BwjKmtbOztyZyM9lsgK1wxm5yxHXyNnpr2jOovzAAxnkl3PVEwmYsgzYDhrLBev5y3LyCJniDxnMng1lytbbrJr2ChPSD21lztDeAxb1mNi1otfVn1jkC29zCJ9hutD5yNb4tMXYmY9JCfvjBJyYsdzolO5oBO4XmtPtmJmWvwnmzvzpCc4ZAhqYnfaVAuLxnxnlsePHsNnOogmZtxCZywPUmNb4wLfbCdHtBdDYnM9ZlLCOtwnPCxbOq2fZmwX1yOuXDtHVlZnM#CWS1odK',
    'https://vk.com/mp3/audio_api_unavailable.mp3?extra=AdbkBKyYsM9vtxfZlNe2vJaZzZrpsgzkyvn4zMfAmvjyuMnLtOXHDg5nrdq1mMjLuLmYouK9AMy1BNb4BJCYDKDLCZfpmZeOBMnFsMrOtL9psMv5oxLJrhbwterpyJrSqwvRys9SwMLfBwnbt2zLy2WTlJv5lZm4s3qWCgXeody3nMLFyMi5yvnUDLq1AI5Rzs94CMWZogrPCLLWofbOAZ8TuY9ZuOr1txi6CdneA2KToxrKy1bLCdrOmKmTlu5IwgzexZqYCa#CWSXote',
    'https://vk.com/mp3/audio_api_unavailable.mp3?extra=vLLOmvjVA189zxbvn3K/EJfTCJDHmwfVsMKXvxfKAuDNqw16r2HezhH4ChLfns1My3aWwefSDK9QyZKZB3b6A2K2r2uWC2H6zfvFrNfzEgnXoxjWrM5rEI84uc9KB3i2lZeYBNHetJPitxDjy3zeBuP1CdzLohr4wNqWmuPfoffUzxj6BuPPCZfJmwrFyw9YAdfsCg9HAtjOy3vemhLvCx0UlKPkuJDZmMGZoc5JAdKZBwHtugvSuxnLotbwngPwCNnfog5znc94#CWSZmJu',
    'https://vk.com/mp3/audio_api_unavailable.mp3?extra=AdeZx2jMouH3nxrmmM9fCdP2ms9KuMvVCJnIohnpAhy/nvLzthj4vZr4mJeOzMmVB21cDY1NzY9xvMO4nI9brhm4AfHZotDZD3aUBtbiuJzHtwLWzviYqJGYEKGZDdb1ExGZvteXm2OOmZuOyNaZsMf4CgKYtLzHq3biB2XmAteYDeLsuM41r3u4x19OCZvyt3HYtNrUou5FyY8OtwuOshrJugvJBOK2m3nvtgj1AtfKAe9Ym2vuqw5Iwtz1vI9ZwNf1Dc5imdOTlwuWtvG1os5WqtLdmMPP#CWS3mZe',
    'https://vk.com/mp3/audio_api_unavailable.mp3?extra=AdbfrN0Xmwn3uhrLA2fXng9OEeH0l2vHvY1Ntve3mtnelZDul3iYx2LRufb1lM5MrweOB3GVBNLhzI12rxnKAe89ztnYvwLAnOuZsen3txbbzZnnANzMu2zAtuqOyZD5vtiOsZLPy1HKmLi3qOnsBJfrr3PxmZrwvZHzAf9ZBuvmvgzJwtqTAM9TmK9VC2SXnJG5nL9LCg03lwzLvujUzK5gyY5LuKTJvJPMs1LTCNrQDc52qJ9Ys3fkohGOnZjWzhbTmZnZDG#CWS2mta'
];

test_urls.forEach(item => console.log(transform(item)));

function transform (source) {
    const map = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=';
    const transforms = {
        v: function (t) {
            console.log('V');
            return t.split('').reverse().join('')
        },
        r: function (t, e) {
            console.log('R');
            t = t.split('');
            for (var i, o = map + map, a = t.length; a--;)
                i = o.indexOf(t[a]), ~i && (t[a] = o.substr(i - e, 1));
            return t.join('')
        },
        s: (string, number) => {
            console.log('S');
            const size = string.length;
            if (size) {
                var o = hueta(string, number);
                var a = 0;
                for (string = string.split(''); ++a < size;) {
                    string[a] = string.splice(
                        o[size - 1 - a], 1, string[a]
                    )[0];
                }
                string = string.join('')
            }
            return string;
        },
        x: function (t, e) {
            console.log('X');
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
        if (size) {
            let count = size;
            for (number = Math.abs(number); count--;) {
                array[count] =
                    (number += number * (count + size) / number) % size | 0
            }
        }
        return array
    }
}
