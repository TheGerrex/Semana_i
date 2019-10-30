import { h } from "@stencil/core";
// import Fragment from 'stencil-fragment';
import init from '../../../www/assets/carbonldp.js';
export class MyComponent {
    constructor() {
        this.isLoading = true;
    }
    loadCarbon() {
        const tagCanvasScript = document.createElement("script");
        tagCanvasScript.onload = () => { this.isLoading = false; };
        tagCanvasScript.src = "carbonldp.js";
        this.el.appendChild(tagCanvasScript);
        console.log("CarbonLDP");
    }
    render() {
        return (init());
        h("div", { id: "tags" });
        ;
    }
    static get is() { return "data-cloud"; }
    static get originalStyleUrls() { return {
        "$": ["data-cloud.css"]
    }; }
    static get styleUrls() { return {
        "$": ["data-cloud.css"]
    }; }
    static get states() { return {
        "isLoading": {}
    }; }
    static get elementRef() { return "el"; }
}
