import { h } from "@stencil/core";
// import Fragment from 'stencil-fragment';
export class MyComponent {
    constructor() {
        this.isLoading = true;
        this.data = [];
    }
    loadCarbon() {
        const tagCanvasScript = document.createElement("script");
        tagCanvasScript.onload = () => { this.isLoading = false; };
        tagCanvasScript.src = "carbonldp.js";
        this.el.appendChild(tagCanvasScript);
        console.log("CarbonLDP");
    }
    makeList() {
        const divT = document.querySelector("#tags");
        const ul = document.createElement("ul");
        divT.appendChild(ul);
        data.map(function (data, bindings) {
            const lis = document.createElement("li");
            lis.innerHTML = `<a href="#" data-weight=` + data.bindings["movieCount"] + `>` + data.bindings["keywordLabel"] + `</a>`;
            ul.appendChild(lis);
            console.log("IT");
        });
    }
    render() {
        return (h("div", { id: "tags" },
            h("ul", null, this.makeList())));
    }
    static get is() { return "data-cloud"; }
    static get originalStyleUrls() { return {
        "$": ["data-cloud.css"]
    }; }
    static get styleUrls() { return {
        "$": ["data-cloud.css"]
    }; }
    static get properties() { return {
        "data": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "any[]",
                "resolved": "any[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "[]"
        }
    }; }
    static get states() { return {
        "isLoading": {}
    }; }
    static get elementRef() { return "el"; }
}
