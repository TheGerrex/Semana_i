import {Component, Element, State, h, Prop} from '@stencil/core';
// import Fragment from 'stencil-fragment';




@Component({
  tag: 'data-cloud',
  styleUrl: 'data-cloud.css'
})
export class MyComponent {

  @Element() el: HTMLElement;
  @State() isLoading: boolean = true;
  @Prop() data: any = [];

  loadCarbon(){
    const tagCanvasScript = document.createElement("script");
    tagCanvasScript.onload = () => {this.isLoading = false}
    tagCanvasScript.src = "carbonldp.js";

    this.el.appendChild(tagCanvasScript);
    console.log("CarbonLDP");
  }

  componentDidUpdate() {
    TagCanvas.Reload("myCanvas");
  }

  makeList() {
    console.log('Data', this.data);
    return this.data.map((item) => (<li><a href="#" data-weight={item.movieCounter}>{item.keywordLabel}</a></li>))

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
      return (

        <div id="tags">
          <ul>
            {this.makeList()}
          </ul>
        </div>
      )
    }
  }
}
