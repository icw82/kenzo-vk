import del = require('del');
import { TaskFunction } from 'undertaker';


const paths = [
    'build/**/*',
];

const clean: TaskFunction = () => del(paths);


export {
    clean,
};
