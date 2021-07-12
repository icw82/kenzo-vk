// TODO: в KK
core.utils.format_filesize = size => {
    const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ']; // FUTURE: i18n

    return each (units, (unit, index) => {
        const limit = Math.pow(10, 3 * (index + 1));
        let output;

        if (size < limit * 0.8) {
            if (size < limit * 0.02)
                output = Math.round(size / limit * 10000) / 10
            else
                output = Math.round(size / limit * 1000);

            output = output.toLocaleString();
            output += ' ' + unit;
            return output;
        }
    });
}
