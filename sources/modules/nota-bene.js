(function(kzvk) {
'use strict';

var mod = new kzvk.Module('noname');

// CONTENT
mod.init__content = function() {

}

// BACKGROUND
mod.init__background = function() {

}

// Включение модуля
kzvk.modules[mod.name] = mod;

})(kzvk);


// --------------------------------------
(function(kzvk) {
'use strict';

var mod = kzvk.modules.noname;

mod.init__content = function() {

}

})(kzvk);


// element, node — обязательно DOM Element
// item — элемент списка.

//    "browser_action": {
//        "default_icon": {
//            "19": "icons/19.png",
//            "38": "icons/38.png"
//        }
//    },

//    chrome.tabs.query({url: [
//        "*://vk.com/*",
//        "*://*.vk.com/*",
//        "*://*.vk.me/*"
//    ]}, function(tabs) { console.log(tabs)})


//    var xhr = new XMLHttpRequest();
//    var url = 'https://api.vk.com/method/groups.getMembers?group_id=70770587';
//    xhr.open('GET', url, true);
//    xhr.onreadystatechange = function() {
//        if (xhr.readyState !== 4) return false;
//        if (xhr.status === 200) {
//            console.log('API:', this.response);
//        }
//    }
//    xhr.send(null);


//    var graph_of_dependencies = {
//        vertices: [],// вершины
//        edges: [] // дуги
//    }
//
//    for (let module_name in kzvk.modules) {
//        // Классический граф
//        graph_of_dependencies.vertices.push(module_name)
//
//        each (kzvk.modules[module_name].dependencies, function(adjacent) {
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
