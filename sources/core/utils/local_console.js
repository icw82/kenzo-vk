core.utils.local_console = (object, prefix) => {
    if (!kk.is.o(object) || !kk.is.s(prefix))
        throw kk.msg.ia;

    prefix += ` (${core.s}) —`;

    const add_prefix = args => {
        args = Array.prototype.slice.call(args);
        args.unshift(prefix);
        return args;
    }

    ['log', 'info', 'warn', 'error'].forEach(method => {
        object[method] = function() {
            if (
                ext &&
                ext.loaded &&
                ext.options &&
                ext.options.debug &&
                !ext.options.debug.log
            ) {
                return;
            }

            console[method].apply(this, add_prefix(arguments));
        }
    });

//    object.flood = function() { }
}
