mod.init__background = function() {
    chrome.downloads.onCreated.addListener(function(item){
        //var id = item.id;
        mod.log('downloads.onCreated', item);
    })

//    chrome.downloads.onErased.addListener(function(item){
//        var id = item.id;
//        mod.log('onErased', item);
//    })

    mod.watch.start();

    chrome.downloads.onChanged.addListener(mod.downloads_listner);

    chrome.runtime.onMessage.addListener(mod.message_listner);

    mod.dispatch_load_event(); // FUTURE: Определить зависимости для модулей, использующих загрузки
}
