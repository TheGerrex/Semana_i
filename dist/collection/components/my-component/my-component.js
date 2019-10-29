import { h } from "@stencil/core";
import Fragment from 'stencil-fragment';
export class MyComponent {
    constructor() {
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
        return (h(Fragment, null,
            h("div", { id: "myCanvasContainer" },
                h("canvas", { width: "1000", height: "300", id: "myCanvas" },
                    h("p", null, "Anything in here will be replaced on browsers that support the canvas element"))),
            h("div", null,
                h("data-cloud", null))));
    }
    static get is() { return "my-component"; }
    static get encapsulation() { return "shadow"; }
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
}
