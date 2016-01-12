mod.get_audio_element_type = function(element) {
    var _ = false;

    if (!element.classList.contains('audio')) {

        mod.log('Не .audio');
        return _;
    }

    // Кнопка не предназначена для плеера
    if (element.getAttribute('id') === 'audio_global')
        return _;

    // Опредлеение типа элемента
    if (element.parentElement.getAttribute('id') === 'initial_list')
        _ = 'default';
    else if (element.parentElement.getAttribute('id') === 'search_list')
        _ = 'default';
    else if (element.parentElement.getAttribute('id') === 'pad_search_list')
        _ = 'default';
    else if (element.parentElement.classList.contains('audio_results'))
        _ = 'search_audio';
    else if (
        (element.parentElement.parentElement instanceof Element) &&
        element.parentElement.parentElement.classList.contains('show_media')
    )
        _ = 'search';
    else if (element.parentElement.getAttribute('id') === 'pad_playlist')
        _ = 'pad';
    else if (
        element.parentElement.classList.contains('wall_text') ||
        element.parentElement.classList.contains('wall_audio')
    )
        _ = 'wall';
    else if (element.parentElement.classList.contains('post_audio'))
        _ = 'messages';
    else if (element.parentElement.classList.contains('audio_content')) {
        if (element.parentElement.parentElement.classList.contains('choose_audio_row'))
            _ = 'attach';
    }

    return _;
}
