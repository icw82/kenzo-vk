Kenzo VK
==========================
Дополнительные функции для вКонтакта.

* Скачивает аудиозаписи;
* Показывает битрейт аудиозаписей;
* Определяет VBR;
* Показывает прямые ссылки на видео;
* Скрывает навязчивые блоки: рекламу, предложение друзей и приложений.

*Чего никогда не будет в этом расширении:*

* Скинов и тем для вконтактика;
* Слежки за пользователями.

#### Обратная связь
Ящик для жалоб и предложений: [vk.com/kenzovk](http://vk.com/kenzovk).

#### Использование кода расширения
Данное расширение поддерживается и совершенствуется до тех пор,
пока автор сам пользуется этим расширением и социальной сетью «вКонтакте».

Вы можете использовать код или часть кода данного расширения
в своих продуктах только при условии указания авторства:
```
// Author: icw82, http://icw82.ru, http://github.com/icw82
```
<!-- Спасибо, что не пидарасы. -->


#### Changelog
<!--
    "browser_action": {
        "default_icon": {
            "19": "icons/19.png",
            "38": "icons/38.png"
        }
    },

//TODO: Очередь закачки.
//TODO:  — Прогресс закачки проигрываемой записи, котороая ещё не попала в кэш браузера.
//FIXME: — Удаление аудиозаписи при активной закачке.
//TODO: Пометка уже скачанных аудиозаписей.

//TODO: Скачивание видео;
//TODO: Удалять в новостях рекламу групп, в которых я и так состою.
//TODO: Сброс натроек;
//TODO: Обнаружение аудиозаписей-клонов;
//TODO: Автоматически определять производительность страниц с кнопками;
//FIXME: Нет кнопок при поиске через проигрыватель (pad);
//FIXME: Не определяется битрейт при появлении новой записи в ленте.

_0.10.1_
*
-->


##### 0.10

* __β:__ Новый механизм скачивания файлов. Теперь файлы сразу передаются в «загрузки» браузера и уже сам браузер скачивает файл;
* __β:__ Если файл уже присутсвует в директории (включая файлы, скачиваемые в данный момент), то появится диалоговое окно;
* __audio:__ Прогресс-бар в кнопках временно выпелен.

##### 0.9

* __audio:__ В настройках можно выбрать разделитель (тире или дефис) в названии сохраняемой аудиозаписи (тире по умолчанию);
* __audio:__ Добавлен упрощённый вид кнопок (отключен по умолчанию). _Если потребуется работа с большим количеством кнопок на странице и браузер начитает тормозить, то лучше включить упрощённый вид кнопок, в котором отсутствует анимация;_
* __audio:__ Исправлено определение среднего битрейта для аудиозаписей с VBR (если опция определение VBR выключена).
* __audio:__ Теперь кнопки есть в Диалогах;
* __audio:__ Теперь кнопки есть в окне прикрепления аудиозаписи к посту или сообщению;
* __audio:__ Исправлены стили в вставке поста в личных сообщениях;
* __audio:__ Исправлено отображение кнопки трансляции в записи на стене;
* __audio:__ Исправлен стиль блока аудиозаписи в комментарии;
* __video:__ Добавлены прямые ссылки на видеозаписи (выключено по умолчанию). _Только для видеозаписей, расположенных на серверах vk.com;_
* __trash:__ Скрытие блока «Популярные сообщества»;
* __trash:__ Скрытие рекламного блока между постами, при переключениях между разделами VK;

<!--
_0.8.7_

* __audio:__ Добавлен упрощённый вид кнопок (отключен по умолчанию). Если потребуется работа с большим количеством кнопок на странице и браузер начитает тормозить, то лучше включить упрощённый вид кнопок, в котором отсутствует анимация.
* __audio:__ Исправлены стили в вставке поста в личных собщениях;
* __trash:__ Скрытие блока «Популярные сообщества»;

_0.8.6_

* __audio:__ Исправлено отображение кнопки трансляции в записи на стене.

_0.8.5_

* __audio:__ Кнопка теперь есть в окне прикрепления аудиозаписи к посту или сообщению;
* __audio:__ Исправлен стиль блока аудиозаписи в комментарии.

_0.8.4_

* __audio:__ В настройках можно выбрать разделитель (тире или дефис) в названии сохраняемой аудиозаписи (тире по умолчанию);
* __audio:__ Теперь кнопки есть в Диалогах;
* Прочие исправления.


_0.8.3_

* __video:__ Добавлены прямые ссылки на видеозаписи (выключено по умолчанию). _Только для видеозаписей, расположенных на серверах vk.com;_


_0.8.2_

* __audio:__ Исправлено определение среднего битрейта для аудиозаписей с VBR (если опция определение VBR выключена).
* Исправление описания расширения.

_0.8.1_

* __trash:__ Скрытие рекламного блока между постами, при переключениях между разделами VK;
-->

##### 0.8
* __audio:__ Определение VBR (опционально, выключено по умолчанию).<br/> *[VBR](http://ru.wikipedia.org/wiki/MP3#VBR) (англ. Variable Bit Rate) — переменный битрейт. Невозможно однозначно определить точный битрейт Аудиозаписей, кодированных этим методом. Если данная опция выключена, битрейт аудиозаписей с VBR будет рассчитан по стандартной формуле:*<br/>```(размер_файла – размер_ID3_тегов) / длительность```
* __audio:__ Кэширование информации об аудиозаписях теперь опционально (включено по умолчанию);
* __audio:__ При удалении аудиозаписи, кнопка адекватно на это реагирует ```×_×```.
* Прочие исправления.


<!--
_0.7.2_

* __audio:__ Исправлены стили;
* __audio:__ Исправлен баг при востановлении аудиозаписи;
* __audio:__ Определение VBR (опционально, выключено по умолчанию).

_0.7.1_

* Рефакторинг,
* __audio:__ Кэширование информации об аудиозаписях теперь опционально (включено по умолчанию);
* __audio:__ При удалении аудиозаписи, кнопка адекватно на это реагирует ```×_×```.

-->

##### 0.7
* Запилена страница настроек;
* __audio:__ Индикация изъятых и недоступных аудиозаписей;
* __audio:__ Доработаны стили кнопки, появилась анимация;
* __trash:__ Скрытие рекламного блока между постами;
* __trash:__ Скрытие блока с предложением «друзей» в сайдбаре слева;
* Прочие исправления.

<!--

_0.6.6_

* Страница настроек;
* Появилось несколько опций для блока __trash__ (скрытие навязчивых блоков);
* __trash:__ Скрытие рекламного блока между постами;
* __audio:__ Дополнен стиль недоступных аудиозаписей.

_0.6.5_

* __audio:__ Исправлены стили (кнопка в плейлисте).

_0.6.4_

* __audio:__ Рефакторинг некоторых функций.

_0.6.3_

* __audio:__ Новый механизм определения битрейта;
* __audio:__ Исправлены стили;
* __audio:__ Индикация изъятых и недоступных аудиозаписей.

_0.6.2_

* Кнопка расширения в панели браузера выпелена, поскольку не имеет никакого функционала;
* __trash:__ Скрытие блока с предложением «друзей» в сайдбаре слева;
* __audio:__ Кеширование битрейта снова работает;
* __audio:__ Доработаны стили кнопки, появилась анимация.

_0.6.1_

* __audio:__ Кэширование временно выпелено.

-->

##### 0.6
* __audio:__ Кэширование информации о аудиозаписях (битрейт);
* __audio:__ Теперь при измении информации аудиозаписи кнопка не пропадает;
* __audio:__ Теперь кнопки есть в поиске по аудиозаписям;
* __audio:__ Исправлено определение битрейта для записей с битрейтом в 320 kbps;
* __trash:__ Скрытие блока рекламы в сайдбаре слева;
* Прочие исправления.

<!--
_0.5.5_

* β: Кэширование информации о аудиозаписях (битрейт);
* Исправлен стиль блока аудиозаписи в комментарии на стене;
* Исправлен стиль слока аудиозаписи в разделе «аудиозаписи».

_0.5.4_

* Исправлено скрытие рекламы.

_0.5.3_

* Исправлено определение битрейта для записей с битрейтом в 320 kbps;
* Теперь скрывает блок рекламы в сайдбаре слева.

_0.5.2_

* Теперь кнопки есть в общем поиске.

_0.5.1_

* Теперь кнопки есть в поиске по аудиозаписям;
* Теперь при измении информации аудиозаписи кнопка не пропадает.
-->

##### 0.5
* __audio:__ Новые стили по предложению [Александра Журавского](http://vaderzone.ru/);
* __audio:__ Убран текстовый индикатор в прогресс-баре (проценты);
* __audio:__ Округление битрейта;
* Иконка расширения.

<!--
##### 0.4.6
* Дополнительные иконки расширения.

##### 0.4.5
* Округление битрейта.

##### 0.4.4
* Коррекция стилей.

##### 0.4.3
* Иконка расширения.

##### 0.4.2
* Новые стили по предложению [Александра Журавского](http://vaderzone.ru/);
* Убран текстовый индикатор в прогресс-баре (проценты).

##### 0.4.1
* Исправлена ошибка с обработкой аудиозаписей в поиске.
-->

##### 0.4
* Добавлена возможность скачивания аудиозаписей из постов;
* Поправлены стили.

##### 0.3
* Запилен прогресс-бар;
* Отмена закачки.

##### 0.2
* Новый вид кнопки закачки, совмещённой с показателем битрейта.
