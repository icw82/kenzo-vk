import { resolve, join } from 'path';


const base_dir = resolve(join(__dirname, '..'));
const sources = join(base_dir, 'sources');
const destination = join(base_dir, 'build');


export {
    base_dir,
    destination,
    sources,
};
