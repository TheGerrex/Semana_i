import { r as registerInstance, h, c as getElement } from './core-de75d7a0.js';

const Fragment = (props, children) => [ ...children ];

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The first name
         */
        this.data = { items: [] };
        this.myTitle = "";
        this.isLoading = true;
    }
    async printConsoleLog() {
        console.log("method");
    }
    componentDidLoad() {
        const tagCanvasScript = document.createElement("script");
        tagCanvasScript.onload = () => { this.isLoading = false; };
        tagCanvasScript.src = "http://www.goat1000.com/tagcanvas.min.js?2.9";
        this.el.appendChild(tagCanvasScript);
        console.log("Done");
    }
    render() {
        if (!this.isLoading) {
            try {
                window['TagCanvas'].Start('myCanvas', 'tags', {
                    textFont: 'Roboto',
                    textColour: '#ff970c',
                    outlineColour: '#08454a',
                    reverse: true,
                    depth: 2,
                    interval: 20,
                    minBrightness: 0.1,
                    pulsateTo: 0.2,
                    pulsateTime: 0.75,
                    initial: [0.1, -0.1],
                    decel: 0.98,
                    hideTags: false,
                    shadow: '#ccf',
                    shadowBlur: 3,
                    weight: true,
                    weightFrom: 'data-weight',
                    fadeIn: 800,
                    maxSpeed: 0.05
                });
            }
            catch (e) {
                // something went wrong, hide the canvas container
                document.getElementById('myCanvasContainer').style.display = 'none';
            }
        }
        ;
        return (h(Fragment, null, h("div", { id: "myCanvasContainer" }, h("canvas", { width: "1000", height: "300", id: "myCanvas" }, h("p", null, "Anything in here will be replaced on browsers that support the canvas element"))), h("data-cloud", null)));
    }
    get el() { return getElement(this); }
    static get style() { return ""; }
};

export { MyComponent as my_component };
