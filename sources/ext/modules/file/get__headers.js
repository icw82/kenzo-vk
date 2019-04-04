mod.get__headers = url => new Promise(function(resolve, reject) {

    if (!kk.is.s(url)) {
        throw `file.get__headers: url is’nt string`;
    }

    if (url === ``) {
        throw `file.get__headers: url is empty string`;
    }

    const data = {
        basic: {
            url: url
        }
    };

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.HEADERS_RECEIVED) {
            if (xhr.status === 200) {
                data.basic.mime = xhr.getResponseHeader('content-type');
                data.basic.size = Number.parseInt(xhr.getResponseHeader('content-length')) || null;
                data.basic.modified = Date.parse(xhr.getResponseHeader('last-modified')) || null;
                data.basic.expires = Date.parse(xhr.getResponseHeader('expires')) || null;

                resolve(data);
            } else {
                reject({
                    error: '1',
                    status: xhr.status
                });
            }

        } else if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
//                mod.log('SUCCESS', xhr.status);
            } else {
                reject({
                    error: '2',
                    status: xhr.status
                });
            }
        }

    });

    xhr.open('HEAD', url, true);
    xhr.send();

});



//readystatechange    Event
//    The readyState attribute of a document has changed.
//
//          UNSENT 0 Объект был создан. Метод open() ещё не вызывался.
//          OPENED 1 Метод open() был вызван.
//HEADERS_RECEIVED 2 Метод send() был вызван, доступны заголовки (headers) и статус.
//         LOADING 3 Загрузка; responseText содержит частичные данные.
//            DONE 4 Операция полностью завершена.
//
//
//loadstart    ProgressEvent
//    readyState = 1
//    Progress has begun
//
//progress    ProgressEvent
//    readyState = 3
//    In progress.
//
//abort    ProgressEvent
//     readyState = 4
//    Progression has been terminated (not due to an error).
//
//error    ProgressEvent
//     readyState = 4
//    Progression has failed.
//
//load    ProgressEvent
//    readyState = 4
//    Progression has been successful.
//
//loadend    ProgressEvent
//    readyState = 4
//    Progress has stopped (after "error", "abort" or "load" have been dispatched).
//
//timeout    ProgressEvent
//    readyState = 4
//    Свойство XMLHttpRequest.timeout определяет количество миллисекунд, которое запрос будет выполняться, до того, как будет автоматически прерван. Имеет размер unsigned long. Значение по умолчанию - 0, определяет, что таймаута нет. Таймаут не должен быть использован в синхронных запросах XMLHttpRequests  в среде документа, или будет вызвано исключение InvalidAccessError. Когда случается таймаут - вызывается событие timeout.
