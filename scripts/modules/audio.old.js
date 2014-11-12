function save(url, name, element){
    (name) || (name = 'kenzo-vk-audio.mp3');

    var
        xhr = new XMLHttpRequest(),
        progress = 0,
        abort = false,

        // TODO: clean
        DOM_kz__carousel =
            element.querySelector('.kz-vk-audio__carousel'),
        DOM_kz__bitrate =
            element.querySelector('.kz-vk-audio__carousel__item.kz-bitrate'),
        DOM_kz__progress =
            element.querySelector('.kz-vk-audio__carousel__item.kz-progress'),
        DOM_kz__progress_filling =
            element.querySelector('.kz-vk-audio__progress-filling');

    DOM_kz__progress.addEventListener('click', function(event){
        kenzo.stop_event(event);
        xhr.abort();
        abort = true;
        //DOM_kz__carousel.localName.addClass('kz-simplified-view');
        toggle_class(element, 'kz-bitrate', audio_item_classes);
    }, false);

    xhr.responseType = 'blob';
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 1)
            toggle_class(element, 'kz-progress', audio_item_classes);
/*
        if ((xhr.readyState === 4) && (xhr.status === 200)){

        }
*/
    }

    xhr.onprogress = function(progress){
        if (progress.lengthComputable && !abort){
            toggle_class(element, 'kz-progress', audio_item_classes);
            progress = Math.floor(progress.loaded / progress.total * 100);
            DOM_kz__progress_filling.style.left = -100 + progress + '%';
            //DOM_kz__carousel.localName.removeClass('kz-simplified-view');
            //DOM_kz__progress.setAttribute('data-progress', progress + '%');
        }
    }
    xhr.onload = function(){
        var blob = new window.Blob([this.response], {'type': 'audio/mpeg'});
        saveAs(blob, name);
        //DOM_kz__carousel.localName.addClass('kz-simplified-view');
        toggle_class(element, 'kz-bitrate', audio_item_classes);
    }
    xhr.open('GET', url, true);
    xhr.send(null);
};
