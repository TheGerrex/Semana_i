import {Component, Element, State, h, Prop} from '@stencil/core';
// import Fragment from 'stencil-fragment';




@Component({
  tag: 'data-cloud',
  styleUrl: 'data-cloud.css'
})
export class MyComponent {

  @Element() el: HTMLElement;
  @State() isLoading: boolean = true;
  @Prop() data = [];

  loadCarbon(){
    const tagCanvasScript = document.createElement("script");
    tagCanvasScript.onload = () => {this.isLoading = false}
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
    this.makeList()
      if(this.data.length > 0) {
        return (

   <div id="tags">
    <ul>
      <li><a href="#" data-weight="14">{this.data[0].keywordLabel}</a></li>
    </ul>
   </div>
   );
      }
  }
}
