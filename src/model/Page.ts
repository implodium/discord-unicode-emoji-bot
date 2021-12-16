export default class Page {

    constructor(public elements: String[], public pageNo: number) {
    }

    get content() {
        return this.elements.join('\n')
    }
}
