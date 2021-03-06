[Kenzo VK](../) → [README](../README.md) → История изменений

История изменений
==========================
<!--
* __video__: Снова можно скачивать видео;
* __audio__: Скачивание голосовых сообщений;
* __ui__: Детектор ловушек;
* __options__: Некотрые пункты теперь помечены как
  «только для десктопной версии VK» и «только для мобильной»;
-->

#### 6.0.3 — 3 Апреля 2019
* __audio__: Исправления от [@lipoiq](https://vk.com/id167562393)


#### 6.0.2 — 7 Декабря 2018
* __audio__: Исправления от [@lipoiq](https://vk.com/id167562393)


#### 6.0.1 — 22 Мая 2018
* __audio__: Исправлен атрибут href кнопки. _Это не влияло на способность
  расширения скачивать файл, однако нельзя было использовать кнопку как ссылку
  («Сохранить ссылку как…», «Копировать адрес ссылки»);_
* __audio__: Исправлены стили кнопки.


#### 6.0.0 — 20 Мая 2018
* Для тестов доступен запуск расширения в браузере Firefox в режиме разработчика
  (требуются последние версии браузера);
* __ui__: В связи с изменениями API VK от 14 мая 2018 идентификаторы страниц
  и пользователей временно не работают;
* __audio__: Исправлена вёрстка объекта аудиозаписи;
* __audio__: Исправлена вёрстка сопроводительного текста аудиозаписи;
* __trash__: Скрытие списка друзей в аудиозаписях теперь работает корректно;
* __trash__: Теперь можно выпиливать «истории» из новостей
  (выключено по умолчанию).


#### 5.5.2 — 23 ноября 2017
* __audio__: Код адаптирован под новые изменения VK;
* __scrobbler__: Скробблер временно выпилен;
* __ui__: При раскруглении индикаторы онлайна на аватаре
  сдвигаются ближе к имени. Отзывы и баг-репорты приветствуются
  в [группе расширения](https://vk.com/kenzovk)
  и на [Гитхабе](https://github.com/icw82/kenzo-vk);
* Исправлен баг, при котором в некоторых браузерах неверно определялась
  кодировка страницы с настройками.


#### 5.5.0 — 12 октября 2017
* Теперь расширение поддерживает скачивание по протоколу http/2
* __scrobbler__: Скробблер снова работает.
* __ui__: Ещё больше раскругления.
* __audio__: Теперь блок аудиозаписи вставленного поста в сообщениях
    не перекрывает элемент оформления цитаты (вертикальной линии).


#### 5.4.3 — 25 августа 2017
* __audio__: Код адаптирован под новые изменения VK;


#### 5.4.2 — 16 августа 2017
* __audio__: Увеличено расстояние между аудиозаписями;
* __audio__: Удаление аудиозаписи теперь делает полупрозрачной кнопку
  проигрывания и кнопку с битрейтом.
* __audio__: Исправлена вёрстка блока выбора плейлиста;


#### 5.4.1 — 23 июня 2017
* Небольшие исправления вёрстки


#### 5.4.0 — 22 июня 2017
* Кнопка расширения в меню браузера теперь открывает настройки расширения;
* __audio__: модуль адаптирован к изменениям vk.com 21 июня;
* __audio__: Увеличены размеры кнопки проигрывания и кнопки с битрейтом;
* __trash__: Блок с плейлистами на странице аудиозаписей выпиливается
  (опция выключена по умолчанию);
* __trash__: «Реклама в сообществах» теперь не убивает диалог/беседу
  в сообщениях при публикации рекламного поста в них;
* __ui__: Изображения в рекомендациях теперь тоже раскругляются;
* __ui__: Раскгругление теперь включено по умолчанию.


#### 5.3.0 — 17 мая 2017

* Теперь в кратком описании расширения написано просто: «Улучшение интерфейса
  VK.com» _(чтобы гугл не доёбывался)_;
* __audio__: теперь кнопка проигрывания всегда заменяется при включенном
  модуле Audio (раньше это было отдельной опцией);
* __audio__: Теперь можно скрыть индикатор «HD» вне зависимости от того,
  включена ли кнопка с битрейтом (опция включена по умолчанию).
* __audio__: Кнопка проигрывания и кнопка с битрейтом имеют сейчас
  «классический» вид;
* __audio__: Изменён цвет полоски в инлайновом проигрывателе (на странице) —
  теперь он белый + изменён цвет индикации предзагрузки аудиозаписи.


##### 5.2.1 — 28 февраля 2017

* В разрешения добавлен домен userapi.com.


#### 5.2.0 — 17 февраля 2017

* __ui__: При наведении на идентификатор (пользователя и пр.) теперь появляется
  подсказка с тем же идентификатором, разряды кратные трём которого отбиваются
  пробелом;
* __music__: внесены изменения в функцию добычи URL аудиозаписи.


#### 5.1.0 — 23 января 2017

* __ui__: Теперь при отключении модуля «Дополнения интерфейса» дочерняя
  опция «Раскругление» корректно выключается. _Спасибо
  [Дмитрию](https://vk.com/id73046910) за наводку._
* __trash__: Скрытие миничата (выключено по умолчанию);
* __trash__: Скрытие записей, размещённых в группах платно (выключено
  по умолчанию);
* __trash__: Скрытие «актуальных фотографий» (включено по умолчанию);
* __trash__: Скрытие друзей в аудиозаписях (выключено по умолчанию);
* Кнопка сброса настроек теперь работает корректно;


##### 5.0.1 — 5 января 2017

* __ui__: Идентификаторы теперь отображаются корректно. _Спасибо
  [Даше Колмаковой](https://vk.com/id13546504) за наводку._


### 5.0.0 — 27 декабря 2016

* Расширение больше не использует для хранения настроек синхронизируемое
  хранилище. Настройки сейчас хоронятся локально — они не синхронизируется
  между браузерами. Некоторые браузеры на основе Хромиума, на которых раньше
  расширение не работало, смогут запустить его (тесты не проводились).
* __scrobbler__: Скробблер снова работает.
* __audio__: Исправлена проблема с кешированием http-заголовков,
  из-за которой расширение считало ссылки на аудио файлы актуальными.
* __ui__: Изменено расположение идентификатора: теперь он располагается
  либо над аватарой, либо над обложкой группы/события.
* __downloads__: Количество скачиваемых одновременно файлов понижено до 4-х,
  остальные файлы будут ожидать своей очереди.


##### 4.1.1 — 27 августa 2016

* Исправлен баг, при котором отключение модуля Trash, но со включенными опциями
  приводило к неработоспособности расширения;
* __ui__: Ещё больше раскругления. _Спасибо
  [qPlazm3r](https://vk.com/id17600363) за большую подборку._


##### 4.1.0 — 22 августа 2016

* __audio__: Исправлено получение названий аудиозаписей из поиска
  (теперь не будет «em» в названиях);
* __audio__: Теперь URL аудиозаписей кэшируются на 12 часов, а не навсегда;
* __audio__: Теперь значок [HQ] у аудиозаписей выпиливается, если кнопки
  с битрейтом включены;
* __ui__: Обесцвечивание аватар выпилено;
* __ui__: Ещё больше раскругления.


### 4.0.0 — 21 августа 2016

* Весь функционал для для старой версии VK теперь недоступен.
* Некоторый функционал теперь работает на новой версии VK;
* Теперь расширение загружается до начала формирования страницы.
  _Например, мусор быстрее выпиливается при первой загрузке сайта_;
* __downloads__: запилена очередь загрузок. _Пока без интерфейса. Детали работы
  очереди будут опубликованы позже;_
* __audio__: Проведена большая ревизия механизма чтения информации из аудио
  файлов:
  теперь большинство «кривых» файлов будут прочитаны и получена корректная
  информация о битрейте, методе кодирования и прочих параметрах вроде частоты
  дискретизации и версии MPEG (эта информация пока не доступна пользователю);
* __audio__: Кнопка, относящаяся к файлу в состоянии ожидания скачивания
  выглядит соответствующим образом (на ней нарисована стрелка вправо);
* __audio__: Появилась возможность включения/отключения кнопок без отключения
  модуля «Аудио». _Теперь можно отключить кнопки, сохранив при этом улучшения
  вёрстки элементов аудиозаписей;_
* __audio__: Теперь можно заменить оригинальную растровую кнопку
  проигрывания (►) на аналогичную менее контрастную векторную;
* __audio__: Добавлено пояснение к настройке «разделитель»;
* __video__: Модуль временно выпелен;
* __trash__: Скрытие репостов временно выпелено;
* __ui__: Исправлено пропадание идентификаторов групп, страниц и пользователей
  при переходе с удалённых или закрытых страниц;
* __ui__: Появилась возможность сделать VK менее круглым;
* __ui__: Теперь можно обесцветить аватары. _Совершенно бесполезная функция_;
* __options__: Опции включения/отключения прогресс-баров выпилены. Теперь
  програсс-бары включены всегда;
* __options__: Теперь перед сбросом настроек, появляется модальное окно для
  подтверждения данного действия.


##### 3.2.1 — 30 марта 2016

* __trash__: исправлено выпиливание продвигаемых постов.


#### 3.2.0 — 29 марта 2016

* __scrobbler__: Теперь есть возможность передавать в скробблер нефильтрованные
  называния аудиозаписей (опция в настройках);
* __trash__: Исправлена неполадка, при которой не скрывались продвигаемые посты
  при переключении между разделами сайта;
* Фильтр названий теперь корректно обрабатывает вопросительные знаки
  и многоточия.


##### 3.1.1 — 11 марта 2016

* __trash__: Исправлено выпиливание рекламы в сайдбаре, в связи с изменением
  идентификатора элемента;
* __audio__: Теперь кнопки есть в истории вложений к беседе.


#### 3.1.0 — 27 января 2016

* Обновлён механизм кэша. _Предполагается, что некотарая нестабильность в работе
  VK впредь не будет блокировать получение информации об аудиозаписях из кэша._
* Фильтр названий скачиваемых файлов теперь заменяет идущие подряд точки на одну
  и удаляет точку в начале названия;
* __ui__: Цифровые идентификаторы групп и страниц в заголовках
  (на синей плашке);


### 3.0.0 — 12 января 2016

* Незначительно изменён внешний вид настроек;
* Переписан код: неподдерживаемая с 49-й версии Chromium, функция — выпилена;
* __audio__: исправлены стили аудиозаписей, в соответствии с последними
  изменениями в вёрстке VK.
* __audio__: теперь кнопка аудиозаписи, найденной через плеер (музыка ▶),
  имеет корректные цвета при воспроизведении.
* __ui__: Новый модуль дополнений интерфейса UI (User Interface).
  _На данный момент все опции этого модуля выключены по умолчанию;_
* __ui__: Цифровые идентификаторы пользователей в заголовках страниц
  (после имени);
* __ui__: Ссылка на настройки расширения в левом меню.


##### 2.1.1 — 20 октября 2015

* __fix:__ Использован традиционный синтаксис объявления функций, вместо
  стрелочной формы, чтобы текущая версия Яндекс.Браузера понимала код;
* __video:__ Исправлена неполадка, при которой не появлялись кнопки под видео
  со включенным в браузере Adobe Flash Player.


#### 2.1.0 — 19 октября 2015

* __audio:__ Теперь атрибут title кнопки содержит информацию о размере файла.
  _Чтобы увидеть размер файла, нужно навести на кнопку курсор. Для видео эта
  функция пока отсутствует_;
* __video:__ Формат видеозаписи перед расширением в названии файла теперь
  опционален.


### 2.0.0 — 25 сентября 2015

* Переписана большая часть базового кода расширения. _Поэтому изменилась
  мажорная версия. Подробнее о версионировании можно почитать здесь:
  http://semver.org/lang/ru/;_
* __video:__ Запилены кнопки для плеера на html5 _(если в браузере отключен
  или отсутствует Adobe Flash Player);_
* __video:__ Теперь если использовать кнопку как ссылку (в контекстном меню
  пункт «сохранить ссылку как…»), то файл будет сохраняться с правильным именем.
  _Прогресс-бар в кнопке для такого способа скачивания пока не доступен;_
* __video:__ Теперь в названии файла перед расширением пишется формат.
  _Например: Название ролика.720.mp4_


##### 1.3.6 — 20 августа 2015

* __trash:__ Теперь выпиливаются репосты пользователей и групп (выключено
  по умолчанию);
* __audio:__ Опция VBR выпелена, теперь VBR определяется _всегда_;
* Аудио и видеозаписи с тильдой (~) в названиях теперь скачиваюстя корректно;
* Фильтр названий скачиваемых файлов теперь заменяет запрещённые символы
  на пробелы, а не удаляет их. Пробелы, в свою очередь, если они расположены
  друг за другом, сокращаются до одного.


##### 1.3.5 — 18 июля 2015

* Теперь на кнопках работает drag'n'drop, можно скачивать, перетаскивая ссылку
  в нужное место;
* __video:__ Кнопка «1080» теперь имеет правильную позицию;
* __video:__ Исправлены стили.


##### 1.3.4 — 3 июля 2015

* __trash:__ Улучшена идентификация продвигаемых постов в новостной ленте;
* __trash:__ Теперь прокрутка в сообщениях не портится после сбора большого
  количества «мусора».


##### 1.3.3 — 22 июня 2015

* __video:__ Длинные названия теперь не влияют на ширину плеера.


##### 1.3.2 — 8 июня 2015

* __trash:__ Теперь выпиливается «Заполненность профиля»;
* __trash:__ Теперь выпиливается большая кнопка ♥ на изображениях (выключено
  по умолчанию).


##### 1.3.1 — 27 мая 2015

* __scrobbler:__ Исправлен скробблинг для зацикленных треков. Теперь для
  каждого цикла будет передаваться своё время начала прослушивания;
* __trash:__ Теперь выпиливаются «продвигаемые посты» в новостной ленте
  (выключено по умолчанию).


#### 1.3 — 12 мая 2015

* __audio:__ Теперь если использовать кнопку как ссылку
  («сохранить ссылку как…»), то файл будет сохраняться с правильным именем.
  _Прогресс-бар для такого способа скачивания пока не доступен;_
* __scrobbler:__ Скробблинг Last.fm (для тестирования, выключен по умолчанию).

##### 1.2.5 — 27 апреля 2015

* Снова изменено описание.


##### 1.2.4 — 24 апреля 2015

* Иконка отмены теперь векторная;
* Изменение описания, в связи с тем, что chrome web-store снова жалуется
  на него.


##### 1.2.3 — 27 января 2015

* Настройки перевёрстаны;
* Теперь пробел перед расширением файла из названий скачиваемых файлов удаляется
  корректно.


##### 1.2.2 — 21 января 2015

* Теперь через контекстное меню можно взаимодействовать с прямой ссылкой
  на аудио- или видеозапись. _Для этого нужно нажать на кнопку с битрейтом
  (или форматом) правой кнопкой мыши и выбрать соответствующую команду
  (например, «Копировать адрес ссылки»)._


##### 1.2.1 — 18 января 2015

* __audio:__ После удаления аудиозаписи кнопка не пропадает, а изменяется на
  ```×_×```;
* __audio:__ После изменения информации аудиозаписи кнопка не пропадает;
* __audio:__ Теперь прогресс-бар виден, если скачиваемая аудиозапись
  проигрывается.
* __Настройки:__ Теперь настройки можно вернуть к первоначальным;
* __Настройки:__ Небольшие исправления;
* Из названий сохраняемых файлов удаляются лишние множественные пробелы,
  пробелы в начале и конце названия, а также перед расширением файла;
* Теперь из названий сохраняемых файлов удаляются квадратные и фигурные
  скобки вместе с содержимым (в настройках можно отключить; включено
  по умолчанию).


#### 1.2.0 — 3 января 2015

* Теперь в настройках можно отключать модули целиком.
* __video:__ Отредактирована оригинальная вёрстка видеозаписи
  (блок .mv_info_panel). _Теперь длинные названия не обрезаются, а переносятся
  на следующую строку. Увеличены отступы._
* __video:__ Добавлены кнопки для скачивания видеозаписей, находящихся на
  серверах VK. _Кнопки не появятся, если используется сторонний видеохостинг._


##### 1.1.4 — 1 января 2015

* Исправления и отлов багов;
* Модуль __Video__ временно выпилен.


##### 1.1.3 — 29 декабря 2014

* Фоновая страница теперь работает всегда. _Это позволяет избежать задержки
  начала скачивания, которая раньше имела место при некоторых условиях._
* В настройках можно включить режим отладки (бесполезная для пользователей
  фича).


##### 1.1.2 — 29 ноября 2014

* __audio:__ Идентификатор аудиозаписи в плеере теперь определяется корректно,
  без приставки _pad, что приводит к уменьшению запросов к серверу и более
  эффективному использованию кэша;
* __audio:__ Кнопки теперь есть в поиске через проигрыватель (pad);
* __audio:__ Исправлен стиль элемента аудиозаписи на странице поиска, теперь
  скачков при наведении нет.


##### 1.1.1 — 26 ноября 2014

* __fix__: аудиозапись в поиске не скачивалась.
* __fix__: аудиозаписи в поиске теряли кнопки.


#### 1.1.0 — 26 ноября 2014

* __audio:__ Прогресс-бар в кнопках запилен обратно.
* __audio:__ Теперь прогресс-бар не привязан к конкретному элементу DOM.
  _Это значит, что прогресс-бар будет отображаться на всех страницах, на которых
  присутствует скачиваемая аудиозапись. Даже если начать скачивать аудиозапись,
  закрыть страницу и во время скачивания открыть страницу снова, то там будет
  отображаться прогресс-бар._
* __audio:__ Прогресс-бары можно отключить в настройках расширения.


##### 1.0.2 — 14 ноября 2014

* __audio:__ Исправлены некоторые стили аудиозаписей: теперь в них влазит больше
  текста;
* __audio:__ Сокращена максимальная длина имени автора в аудиозаписи, теперь она
  занимает примерно половину строки и не мешает чтению названия;
* Теперь из назавний сохраняемых файлов также удаляется символ `"`.

##### 1.0.1 — 13 ноября 2014

* __audio:__ Исправлен повтор создания кнопки, приводящий к дублированию оной.


### 1.0.0 — 13 ноября 2014

* Рефакторинг — реорганизация кода без изменения функционала расширения;
* В связи с тем, что аудиозаписи начали раздаваться с домена vk-cdn.net,
  он дополнил список доменов (в манифесте), к котором нужно разрешить доступ;
* Из названий сохраняемых файлов удаляются символы: `\`, `/`, `*`, `?`, `<`,
  `>`, `:`, и `|`.
* Теперь по умолчанию включены: прямые ссылки на видео и определение VBR.
  _Это никак не повлияет на уже настроенное расширение;_
* __audio:__ Теперь в качестве разделителя можно выбрать среднее тире `–`.

<!--
_0.10.3 — 2014.10.28_

* В связи с тем, что аудиозаписи начали раздаваться с домена vk-cdn.net,
  он дополнил список доменов (в манифесте), к котором нужно разрешить доступ.

_0.10.2_

* Незначительные изменения

_0.10.1_

* Из названий закачиваемых файлов удаляются символы: \, /, *, ?, <, >, :, и |.
-->


### 0.10

* __β:__ Новый механизм скачивания файлов. Теперь файлы сразу передаются
  в «Downloads» браузера и уже сам браузер скачивает файл;
* __β:__ Если файл уже присутсвует в директории (включая файлы, скачиваемые
  в данный момент), то появится диалоговое окно;
* __audio:__ Прогресс-бар в кнопках временно выпелен.


### 0.9

* __audio:__ В настройках можно выбрать разделитель (тире или дефис) в названии
  скачиваемой аудиозаписи (тире по умолчанию);
* __audio:__ Добавлен упрощённый вид кнопок (отключен по умолчанию).
  _Если потребуется работа с большим количеством кнопок на странице и браузер
  начитает тормозить, то лучше включить упрощённый вид кнопок, в котором
  отсутствует анимация;_
* __audio:__ Исправлено определение среднего битрейта для аудиозаписей с VBR
  (если опция определение VBR выключена).
* __audio:__ Теперь кнопки есть в Диалогах;
* __audio:__ Теперь кнопки есть в окне прикрепления аудиозаписи к посту или
  сообщению;
* __audio:__ Исправлены стили в вставке поста в личных сообщениях;
* __audio:__ Исправлено отображение кнопки трансляции в записи на стене;
* __audio:__ Исправлен стиль блока аудиозаписи в комментарии;
* __video:__ Добавлены прямые ссылки на видеозаписи (выключено по умолчанию).
  _Только для видеозаписей, расположенных на серверах vk.com;_
* __trash:__ Скрытие блока «Популярные сообщества»;
* __trash:__ Скрытие рекламного блока между постами, при переключениях между
  разделами VK;


### 0.8

* __audio:__ Определение VBR (опционально, выключено по умолчанию).<br/>
  _[VBR](http://ru.wikipedia.org/wiki/MP3#VBR) (англ. Variable Bit Rate) —
  переменный битрейт. Невозможно однозначно определить точный битрейт
  Аудиозаписей, кодированных этим методом. Если данная опция выключена, битрейт
  аудиозаписей с VBR будет рассчитан по стандартной формуле:_
  <br/>```(размер_файла – размер_ID3_тегов) / длительность```
* __audio:__ Кэширование информации об аудиозаписях теперь опционально
  (включено по умолчанию);
* __audio:__ При удалении аудиозаписи, кнопка адекватно на это реагирует
  ```×_×```.
* Прочие исправления.


### 0.7

* Запилена страница настроек;
* __audio:__ Индикация изъятых и недоступных аудиозаписей;
* __audio:__ Доработаны стили кнопки, появилась анимация;
* __trash:__ Скрытие рекламного блока между постами;
* __trash:__ Скрытие блока с предложением «друзей» в сайдбаре слева;
* Прочие исправления.

### 0.6

* __audio:__ Кэширование информации о аудиозаписях (битрейт);
* __audio:__ Теперь при измении информации аудиозаписи кнопка не пропадает;
* __audio:__ Теперь кнопки есть в поиске по аудиозаписям;
* __audio:__ Исправлено определение битрейта для записей с битрейтом в 320 kbps;
* __trash:__ Скрытие блока рекламы в сайдбаре слева;
* Прочие исправления.


### 0.5

* __audio:__ Новые стили по предложению
  [Александра Журавского](http://vaderzone.ru/);
* __audio:__ Убран текстовый индикатор в прогресс-баре (проценты);
* __audio:__ Округление битрейта;
* Иконка расширения.


### 0.4

* Добавлена возможность скачивания аудиозаписей из постов;
* Поправлены стили.


### 0.3

* Запилен прогресс-бар;
* Отмена скачивания.


### 0.2

* Новый вид кнопки скачивания, совмещённой с показателем битрейта.


### 11 апреля 2014 — Публикация первой версии в Webstore
