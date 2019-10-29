import { p as patchBrowser, g as globals, b as bootstrapLazy } from './core-a0018b92.js';

patchBrowser().then(options => {
  globals();
  return bootstrapLazy([["data-cloud",[[1,"data-cloud",{"data":[8],"myTitle":[1,"my-title"]}]]],["my-component",[[1,"my-component",{"data":[8],"myTitle":[1,"my-title"],"printConsoleLog":[64]}]]]], options);
});
