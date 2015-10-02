(function(kzvk){
'use strict';

var mod = kzvk.modules.downloads;

mod.big_watch = (function(){

    var interval_id = null,
        interval = 1000,
        _ = {};

    function update(){

    }

    function stop(){
//        clearInterval(interval_id);
//        interval_id = null;
//        mod.log('BIG Watch complete');
    }

    _.start = function(){
        if (interval_id !== null)
            return false;

        update();

        interval_id = setInterval(update, interval);
    }

    return _;

})();


mod.watch = (function(){

    var interval_id = null,
        interval = 1000,
        _ = {};

    function update(){
        chrome.storage.local.get('downloads', function(data){
            var current = data.downloads.current;

            chrome.downloads.search({
                state: 'in_progress'
            }, function(downloads){
                if (downloads.length === 0){
                    stop();
                    return false;
                }

                var list = [];

                each (current, function(item){
                    each (downloads, function(download){
                        if (download.id === item.download_id){
                            item.progress =
                                Math.floor(download.bytesReceived / download.totalBytes * 100);

                            list.push(item);
                            return true;
                        }
                    });
                });

                mod.log('Список загрузок после обновления:', list);

                if (list.length === 0){
                    stop();
                } else {
                    chrome.storage.local.set({
                        'downloads': {
                            'current': list
                        }
                    });
                }
            });
        });
    }

    function stop(){
        chrome.storage.local.set({
            'downloads': {
                'current': []
            }
        });

        clearInterval(interval_id);
        interval_id = null;
        mod.log('Watch complete');
    }

    _.start = function(){
        if (interval_id !== null)
            return false;

        update();

        interval_id = setInterval(update, interval);
    }

    return _;

})();

})(kzvk);
