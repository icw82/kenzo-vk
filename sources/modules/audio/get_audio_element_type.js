mod.get_audio_element_type = function(element) {
    if (!element.classList.contains('audio')) {
        mod.log('Не .audio');
        return false;
    }

    // Кнопка не предназначена для плеера
    if (element.getAttribute('id') === 'audio_global') {
        mod.warn('Кнопка не предназначена для плеера');
        return false;
    }

    // Опредлеение типа элемента
    if (element.parentElement.getAttribute('id') === 'initial_list')
        return 'default';

    if (element.parentElement.getAttribute('id') === 'search_list')
        return 'default';

    if (element.parentElement.getAttribute('id') === 'pad_search_list')
        return 'default';

    if (element.parentElement.getAttribute('id') === 'pad_playlist')
        return 'pad';


    if (element.parentElement.classList.contains('audio_results'))
        return 'search_audio';

    if (
        element.parentElement.classList.contains('wall_text') ||
        element.parentElement.classList.contains('wall_audio')
    )
        return 'wall';

    if (element.parentElement.classList.contains('post_audio'))
        return 'messages';

    if (element.parentElement.parentElement instanceof Element) {
        if (element.parentElement.parentElement.classList.contains('show_media'))
            return 'search';

        if (kk.find_ancestor(element, 'wall_module'))
            return 'wall';
    }

    if (element.parentElement.classList.contains('audio_content')) {
        if (element.parentElement.parentElement.classList.contains('choose_audio_row'))
            return 'attach';
    }


    mod.log('#######################', element)

    mod.warn('Тип элемента не определён');
    return false;
}
