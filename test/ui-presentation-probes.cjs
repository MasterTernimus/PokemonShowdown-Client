/* DOM-only probes for local browser fixtures. Does not read or mutate application state. */
(function (scope) {
 function inspect(root, options) {
  options = options || {};
  var doc = root.ownerDocument || root, width = doc.documentElement.clientWidth, failures = [], checks = 0;
  function check(ok, label) { checks++; if (!ok) failures.push(label); }
  function rect(e) { return e.getBoundingClientRect(); }
  var cards = Array.from(root.querySelectorAll('.setchart'));
  if (options.cards) check(cards.length === options.cards, 'Expected '+options.cards+' cards, got '+cards.length);
  cards.forEach(function (card, index) {
   var label = card.querySelector('input[name="pokemon"]'), name = label ? label.value : String(index);
   check(card.scrollWidth <= card.clientWidth + 2, name+' card overflows');
   var moves = Array.from(card.querySelectorAll('input[name^="move"]'));
   check(moves.length === 4, name+' must retain four move slots');
   moves.forEach(function (move, i) { if (i) check(rect(move).top >= rect(moves[i-1]).bottom, name+' move slots overlap'); });
   Array.from(card.querySelectorAll('.passive-chip')).forEach(function (chip) {
    check(chip.scrollWidth <= chip.clientWidth + 2, name+' passive label clipped: '+chip.textContent);
    check(chip.tagName === 'BUTTON' && chip.hasAttribute('aria-expanded'), name+' passive help inaccessible');
   });
   Array.from(card.querySelectorAll('.meloetta-move-preview,.rks-memory-components')).forEach(function (help) {
    check(rect(help).left >= rect(card).left - 1 && rect(help).right <= rect(card).right + 1, name+' contextual help escapes card');
    moves.forEach(function (move) { var a=rect(help), b=rect(move);check(a.right<=b.left || a.left>=b.right || a.bottom<=b.top || a.top>=b.bottom, name+' helper overlaps move slot'); });
   });
   check(!card.querySelector('.opening-type-profile'), name+' has inline dynamic-type block');
  });
  var header=root.querySelector('.team-editor-header'), drawer=root.querySelector('.team-profile-drawer');
  if(header && drawer) check(rect(drawer).top >= rect(header).bottom, 'Team header overlaps profile drawer');
  Array.from(root.querySelectorAll('.set-passive-description')).forEach(function(e){check(e.scrollWidth<=e.clientWidth+2,'Expanded passive details overflow');});
  var switches=Array.from(root.querySelectorAll('.switchmenu button'));
  if(options.switches)check(switches.length===options.switches,'Switch count mismatch');
  switches.forEach(function(button){
   check(button.scrollWidth<=button.clientWidth+2,'Switch button overflows');
   Array.from(button.querySelectorAll('.hpbar')).forEach(function(bar){
    check(!!bar.getAttribute('aria-label'),'Switch HP lacks accessible text');
    if(bar.firstElementChild)check(rect(bar.firstElementChild).width<=bar.clientWidth+2,'Switch HP fill escapes bar');
   });
  });
  var moveButtons=Array.from(root.querySelectorAll('.battle-move-grid button[name="chooseMove"]'));
  if(options.battleMoves)check(moveButtons.length===4,'Battle must show four moves');
  moveButtons.forEach(function(button){check(button.scrollWidth<=button.clientWidth+2,'Battle move button overflows');});
  return {viewport:width,checks:checks,cards:cards.length,switches:switches.length,failures:failures,passed:failures.length===0};
 }
 if(typeof module==='object' && module.exports)module.exports=inspect;
 else scope.inspectShowdownPresentation=inspect;
})(typeof window==='object'?window:this);
