'use strict';
const assert = require('assert').strict, fs = require('fs'), vm = require('vm');
const source = fs.readFileSync('play.pokemonshowdown.com/js/client.js', 'utf8');
const start = source.indexOf('var loadReplay = function ()');
const code = source.slice(start, source.indexOf('\n\t\t\t\t} else {', start));
function setup() {
 const requests = [], popups = [], messages = [], removed = [], received = [];
 const context = {replayLink:'https://replay.invalid/example',replayid:'example',roomid:'battle-example',errormessage:'Room unavailable',Popup:function(){},
  app:{addPopup:(kind,data)=>popups.push(data),addPopupMessage:text=>messages.push(text),removeRoom:id=>removed.push(id),receive:data=>received.push(data)},
  $:{ajax(url,options){const request={url,options,done(fn){this.success=fn;return this;},fail(fn){this.failure=fn;return this;}};requests.push(request);return request;}}};
 vm.runInNewContext(code, context);
 return {requests,popups,messages,removed,received};
}
describe('Replay request recovery', () => {
 for(const status of [0,403,500,520,522]) it('keeps a retry path for HTTP/network '+status, () => {
  const h=setup();h.requests[0].failure({status});
  assert.equal(h.removed.length,0);assert.equal(h.messages.length,0);assert(!/expired|not found/i.test(h.popups[0].message));
  assert(h.requests[0].options.timeout>0);let closed=false;
  h.popups[0].submit.call({close(){closed=true;}});assert(closed);assert.equal(h.requests.length,2);assert.equal(h.requests[1].url,h.requests[0].url);
  h.requests[1].success({players:['A','B'],log:'|turn|1'});assert(h.received[0].includes('|turn|1'));assert.equal(h.removed.length,0);
 });
 for(const status of [404,410]) it('reports confirmed missing replay '+status,()=>{
  const h=setup();h.requests[0].failure({status});assert.deepEqual(h.removed,['battle-example']);assert.match(h.messages[0],/No saved replay was found/);assert.equal(h.popups.length,0);
 });
});
