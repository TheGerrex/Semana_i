import {Component, Prop, h,Element, State, Method} from '@stencil/core';
import Fragment from 'stencil-fragment';


@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css'
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() data: any = { items: []};
  @Prop() myTitle: string = "";
  @Element() el: HTMLElement;
  @State() isLoading: boolean = true;


  @Method() async printConsoleLog(){
    console.log("method");
  }



   componentDidLoad(){
    const tagCanvasScript = document.createElement("script");
    tagCanvasScript.onload = () => {this.isLoading = false}
    tagCanvasScript.src = "http://www.goat1000.com/tagcanvas.min.js?2.9";

    this.el.appendChild(tagCanvasScript);
    console.log("Done");
  }



  render() {

    if (!this.isLoading) {
     try {
          window['TagCanvas'].Start('myCanvas','tags',{
            textFont: 'Roboto',
            textColour: '#ff970c',
            outlineColour: '#08454a',
            reverse: true,
            depth: 2,
            interval: 20,
            minBrightness: 0.1,
            pulsateTo: 0.2,
            pulsateTime: 0.75,
            initial: [0.1,-0.1],
            decel: 0.98,
            hideTags: false,
            shadow: '#ccf',
            shadowBlur: 3,
            weight: true,
            weightFrom: 'data-weight',
            fadeIn: 800,
            maxSpeed: 0.05
          });
        }
        catch(e) {
          // something went wrong, hide the canvas container
          document.getElementById('myCanvasContainer').style.display = 'none';
        }
      };

    return (
      <Fragment>
      <div id="myCanvasContainer">
        <canvas width="1000" height="300" id="myCanvas">
          <p>Anything in here will be replaced on browsers that support the canvas element</p>
        </canvas>
      </div>
      <data-cloud></data-cloud>
      </Fragment>

    );
  }
}
