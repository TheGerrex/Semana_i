import { r as registerInstance, h, c as getElement } from './core-5e12a2de.js';

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
    render() {
        return (h("div", { id: "tags" }, this.data));
    }
    get el() { return getElement(this); }
    static get style() { return "body {\n  background: #08454a;\n  font-family: \'Open Sans\', sans-serif;\n}\n\n#myCanvasContainer {\n  background: #000000;\n  width: 1000px;\n  height: 300px;\n  border-radius: 10px;\n}\nul {\n  display: none;\n}\n\n#tags {\n  color: white;\n  font-family: \'Roboto\';\n}"; }
};

export { MyComponent as data_cloud };
