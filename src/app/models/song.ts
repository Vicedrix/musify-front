export class Song{
    constructor(
        public _id: string,
        public name: string,
        public number: number,
        public album: string,
        public duration: string,
        public file: string,
    ){}
}