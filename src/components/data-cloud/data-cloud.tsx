import {Component, Element, State, h} from '@stencil/core';
// import Fragment from 'stencil-fragment';
import init from '../../../www/assets/carbonldp.js';



@Component({
  tag: 'data-cloud',
  styleUrl: 'data-cloud.css'
})
export class MyComponent {

  @Element() el: HTMLElement;
  @State() isLoading: boolean = true;

  loadCarbon(){
    const tagCanvasScript = document.createElement("script");
    tagCanvasScript.onload = () => {this.isLoading = false}
    tagCanvasScript.src = "carbonldp.js";

    this.el.appendChild(tagCanvasScript);
    console.log("CarbonLDP");
  }

  render() {
   return (
    init();
   <div id="tags"></div>
   );
  }
}
