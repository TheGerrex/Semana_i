import {Component, Element, State, h} from '@stencil/core';
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
    const divT = document.querySelector("#tags");
    const ul = document.createElement("ul");
    divT.appendChild(ul);
    data.map(function(data.bindings) {
      const lis = document.createElement("li")
      lis.innerHTML = `<a href="#" data-weight=` + data.bindings["movieCount"]+ `>` + data.bindings["keywordLabel"] + `</a>`;
      ul.appendChild(lis);
      console.log("IT");
    })
  }

  render() {
   return (

   <div id="tags">
    <ul>
      {this.makeList()}
    </ul>
   </div>
   );
  }
}
