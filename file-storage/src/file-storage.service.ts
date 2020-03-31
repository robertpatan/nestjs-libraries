import { Injectable } from '@nestjs/common';
import * as fs from "fs";

@Injectable()
export class FileStorageService {
    private readonly baseDir: string;
    constructor() {
        this.baseDir = __dirname;

    }

    async save(path, data, options): Promise<any> {
        return fs.writeFile(path, data, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved
            return true;
        });
    }

    createDirectory(path) {

    }


}
