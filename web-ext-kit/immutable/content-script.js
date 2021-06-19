(async () => {
    const path = chrome.runtime.getURL('main.js');
    const { main } = await import(path);

    try {
        main('content-script');
    } catch (error) {
        console.error(error);
    }
})();
