// Присоединение к странице
core.utils.inject_to_dom = (type, url) => {
    if (!['js', 'svg', 'css'].includes(type))
        return;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let container;
            if (type === 'svg') {
                container = document.createElement('div');
                container.style.display = 'none';

            } else if (type === 'js') {
                container = document.createElement('script');

            } else if (type === 'css') {
                container = document.createElement('style');
            }

            container.innerHTML = xhr.response;
            document.head.appendChild(container);
        }
    }

    xhr.open('GET', url, true);
    xhr.send(null);
}
