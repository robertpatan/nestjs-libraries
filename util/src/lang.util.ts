import {NotAcceptableException, NotFoundException} from "@nestjs/common";
import * as _ from "lodash"
import {en} from "../../../src/common/lang/en";

export class Lang {
    private static instance: Lang;

    readonly appLang: string;
    readonly lang: any;
    readonly replaceableRegex: RegExp;

    constructor() {
        this.appLang = process.env.APP_LOCALE;
        this.lang = en;
        this.replaceableRegex = new RegExp(':\\w+', 'g');

        if (_.isEmpty(this.lang)) {
            throw new NotFoundException('Language file not found.');
        }

    }

    public static getInstance(): Lang {
        if (!Lang.instance) {
            Lang.instance = new Lang();
        }

        return Lang.instance;
    }

    /**
     *
     * @param key
     * @param replaceables  Will replace
     */
    trans(key: string, replaceables: string[] = []) {
        const message = this.getValueFromPath(key);

        return this.replace(message, replaceables);
    }

    /**
     *
     * @param message
     * @param replaceables
     */
    replace(message: string, replaceables: string[] = []) {
        const matches = message.match(this.replaceableRegex);

        if (matches.length !== replaceables.length) {
            throw new NotAcceptableException(this.lang.validation.replaceables_missmatch)
        }

        _.forEach(matches, (needle: string, key: string) => {
            message = message.replace(needle, replaceables[key]);
        });

        return message;
    }

    /**
     *
     * @param path
     */
    getValueFromPath(path: string) {
        let pathArray = path.split('.');
        let current = this.lang;
        let currentSegment: string;


        //search object  tree to return the final string
        while (pathArray.length) {
            currentSegment = pathArray.shift();

            if (typeof current === 'object') {
                current = current[currentSegment];
            } else if (typeof current === 'string') {
                return current;
            }
        }

        if (_.isEmpty(current)) {
            throw new NotFoundException(`Could not find any matching translation for ${currentSegment}.`)
        }

        return current;
    }
}

export default Lang.getInstance();
