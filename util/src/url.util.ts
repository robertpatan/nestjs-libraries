export class Url {
    private static instance: Url;

    public static getInstance(): Url {
        if (!Url.instance) {
            Url.instance = new Url();
        }

        return Url.instance;
    }

    static create(path: string) {
        return `${process.env.APP_URL}/${path}`;
    }


}

export default Url.getInstance();
