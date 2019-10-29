import { r as registerInstance, h } from './core-a0018b92.js';

const Fragment = (props, children) => [ ...children ];

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The first name
         */
        this.data = { items: [] };
        this.myTitle = "";
    }
    async printConsoleLog() {
        console.log("method");
    }
    render() {
        return (h(Fragment, null, h("div", { id: "myCanvasContainer" }, h("canvas", { width: "1000", height: "300", id: "myCanvas" }, h("p", null, "Anything in here will be replaced on browsers that support the canvas element"))), h("div", null, h("data-cloud", null))));
    }
    static get style() { return ""; }
};

export { MyComponent as my_component };
