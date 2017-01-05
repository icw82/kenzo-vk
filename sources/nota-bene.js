// 132 (длина описания)

//"browser_action": {
//    "default_icon": {
//        "19": "images/icons/19.png",
//        "38": "images/icons/38.png"
//    },
//    "default_popup": "layouts/browser_action.html"
//},


// FUTURE: banlist;
//    var xhr = new XMLHttpRequest();
//    var url = 'https://raw.githubusercontent.com/icw82/blacklist/master/blacklist.json';
//    xhr.open('GET', url, true);
//    xhr.onreadystatechange = function() {
//        if (xhr.readyState !== 4) return;
//        if (xhr.status === 200) {
//            var data = JSON.parse(this.response);//
//        }
//    }
//
//    xhr.send(null);
//
//    https://github.com/icw82/blacklist/blob/master/blacklist.json


//    chrome.tabs.query({url: [
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
