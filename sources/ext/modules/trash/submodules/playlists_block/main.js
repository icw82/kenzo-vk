// Блок с плейлистами на странице аудиозаписей
sub.init__content = () => {
    const query = '.audio_section__all .audio_page_block__playlists_items';

    if (ext.mode === 2016) {
        core.events.on_mutation.addListener(() => {
            if (sub.mod.options._ && sub.mod.options.playlists_block) {
                each (query, target => {
                    let block = kk.find_ancestor(
                        target,
                        '._audio_page_titled_block'
                    );

                    if (
                        block.nextElementSibling &&
                        block.nextElementSibling.classList.contains(
                            'audio_page_separator'
                        )
                    ) {
                        sub.mod.drop(block.nextElementSibling);
//                        console.log(sub.name);
                    }
                    sub.mod.drop(block);
                });
            }
        });
    }
}
