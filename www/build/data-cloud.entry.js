import { r as registerInstance, h, c as getElement } from './core-de75d7a0.js';

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
    componentDidUpdate() {
        TagCanvas.Reload("myCanvas");
    }
    makeList() {
        console.log('Data', this.data);
        return this.data.map((item) => (h("li", null, h("a", { href: "#", "data-weight": item.movieCounter }, item.keywordLabel))));
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
        if (this.data.length > 0) {
            return (h("div", { id: "tags" }, h("ul", null, this.makeList())));
        }
    }
    get el() { return getElement(this); }
    static get style() { return "body {\n  background: #08454a;\n  font-family: \'Open Sans\', sans-serif;\n}\n\n#myCanvasContainer {\n  background: #000000;\n  width: 1000px;\n  height: 300px;\n  border-radius: 10px;\n}\nul {\n  display: none;\n}\n\n#tags {\n  color: white;\n  font-family: \'Roboto\';\n}"; }
};

export { MyComponent as data_cloud };
