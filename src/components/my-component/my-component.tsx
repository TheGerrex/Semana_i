import {Component, Prop, h, Method} from '@stencil/core';
import Fragment from 'stencil-fragment';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() data: any = { items: []};
  @Prop() myTitle: string = "";



  @Method() async printConsoleLog(){
    console.log("method");
  }


  render() {

    return (
      <Fragment>
      <div id="myCanvasContainer">
        <canvas width="1000" height="300" id="myCanvas">
          <p>Anything in here will be replaced on browsers that support the canvas element</p>
        </canvas>
      </div>
      <div>
      <data-cloud></data-cloud>
      </div>
      </Fragment>
    );
  }
}
