import { p as patchBrowser, g as globals, b as bootstrapLazy } from './core-5e12a2de.js';

patchBrowser().then(options => {
  globals();
  return bootstrapLazy([["data-cloud",[[0,"data-cloud",{"data":[16],"isLoading":[32]}]]],["my-component",[[0,"my-component",{"data":[8],"myTitle":[1,"my-title"],"isLoading":[32],"printConsoleLog":[64]}]]]], options);
});
