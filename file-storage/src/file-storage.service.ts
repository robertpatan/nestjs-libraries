import * as fs from "fs";
import * as crypto from "crypto";
import {Injectable} from '@nestjs/common';
import {URL} from "url";

@Injectable()
export class FileStorageService {
    public baseDir: string;

    constructor() {
        if(!process.env.STORAGE_PATH) throw 'STORAGE_PATH variable is empty';

        this.baseDir = process.env.STORAGE_PATH;
    }

    /**
     *
     * @param path
     * @param data
     * @param options
     */
    async save(path, data, options = {}): Promise<any> {
        return fs.writeFile(path, data, (err) => {
            if (err) throw err;

            return true;
        });
    }

    /**
     *
     * @param path
     * @param isRecursive
     */
    createDirectoryIfNotExists(path: string, isRecursive: boolean = true) {
        if (fs.existsSync(path)) return;
        return fs.mkdirSync(path, {recursive: isRecursive})
    }

    /**
     *
     * @param path
     */
    async delete(path): Promise<boolean> { //sync implementation
        if (await this.exists(path)) {
            try {
                fs.unlinkSync(path);
            } catch (err) {
                throw 'Could not delete file. -> ' + err;
            }
            return true;
        }

        return false;

    }

    /**
     *
     * @param path <string> | <Buffer> | <URL>
     */
    async exists(path): Promise<boolean> {
        return fs.existsSync(path);
    }

    /**
     * Create a hash from a buffer as input
     *
     * @param buffer
     * @param algorithm
     */
    async getHashFromBuffer(buffer: Buffer, algorithm: string) {
        const hash = crypto.createHash(algorithm);
        hash.update(buffer);

        return hash.digest('hex');
    }


}
