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
        console.log('here', this.data);
        /*const divT = document.querySelector("#tags");
        const ul = document.createElement("ul");
        divT.appendChild(ul);
        if(this.data.length > 0) {
          this.data.map((obj) => {
          const lis = document.createElement("li")
          lis.innerHTML = `<a href="#" data-weight=` + obj["movieCount"]+ `>` + obj["keywordLabel"] + `</a>`;
          ul.appendChild(lis);
        })
        }*/
    }
    render() {
        this.makeList();
        if (this.data.length > 0) {
            return (h("div", { id: "tags" },
                h("ul", null,
                    h("li", null,
                        h("a", { href: "#", "data-weight": "14" }, this.data[0].keywordLabel)))));
        }
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
