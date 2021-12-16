import Page from "./Page.js";

export default class PageList {

    public pages: Page[] = []
    public pageNo: number;

    constructor(private elements: String[], private pageElementCount: number = 25, initialPageNo = 1) {
        this.transformElementsToPages(elements)
        this.pageNo = initialPageNo;
    }


    private transformElementsToPages(elements: String[]) {
        for (let i = 0; i < elements.length; i += this.pageElementCount) {
            this.addNewPageStartingAt(i)
        }
    }

    private addNewPageStartingAt(count: number) {
        const page = new Page(
            this.getNext25ElementsStartingAt(count),
            this.pages.length - 1
        )

        this.pages.push(page)
    }

    private getNext25ElementsStartingAt(count: number) {
        return this.elements
            .slice(
                count,
                Math.min(
                    count + 25, this.elements.length - 1
                )
            )
    }

    public nextPage(): PageList {
        this.changePage(+1)
        return this
    }

    public prevPage(): PageList {
        this.changePage(-1)
        return this
    }

    public changePage(summand: number): PageList {
        this.pageNo = Math.max(
            Math.min(
                this.pageNo + summand,
                this.pages.length - 1,
            ),
            1
        );

        return this
    }

    public get pageContent(): string {
        return this.pages[this.pageNo].content
    }

    public get length(): number {
        return this.pages.length
    }
}
