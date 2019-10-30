import { h } from "@stencil/core";
import Fragment from 'stencil-fragment';
export class MyComponent {
    constructor() {
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
                console.log("DD");
            }
        }
        ;
        return (h(Fragment, null,
            h("div", { id: "myCanvasContainer" },
                h("canvas", { width: "1000", height: "300", id: "myCanvas" },
                    h("p", null, "Anything in here will be replaced on browsers that support the canvas element"))),
            h("div", null,
                h("data-cloud", null))));
    }
    static get is() { return "my-component"; }
    static get originalStyleUrls() { return {
        "$": ["my-component.css"]
    }; }
    static get styleUrls() { return {
        "$": ["my-component.css"]
    }; }
    static get properties() { return {
        "data": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The first name"
            },
            "attribute": "data",
            "reflect": false,
            "defaultValue": "{ items: []}"
        },
        "myTitle": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "my-title",
            "reflect": false,
            "defaultValue": "\"\""
        }
    }; }
    static get states() { return {
        "isLoading": {}
    }; }
    static get methods() { return {
        "printConsoleLog": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
    static get elementRef() { return "el"; }
}
