// INFO this will tell Vitest to use jsdom as the testing environment

import {defineConfig} from 'vitest/config';

export default defineConfig({
    test:{
        environment:'jsdom'
    }
})