import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ 
    path: path.resolve(__dirname, '../.env.saucedemo') 
});

export const ENV = {
    HOMEPAGE: process.env.HOMEPAGE!,
    STANDARD_USER: process.env.STANDARD_USER!, 
    LOCKED_OUT_USER: process.env.LOCKED_OUT_USER!, 
    PASSWORD: process.env.PASSWORD!
};
