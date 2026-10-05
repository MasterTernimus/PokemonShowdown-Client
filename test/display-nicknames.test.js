const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '../play.pokemonshowdown.com/js/battle-log.js'), 'utf8');
function load(app) {
 return new Function('window', 'Config', 'MD5', 'toID', source + '\nreturn BattleLog;')({app}, {customcolors: {}, routes: {}}, () => '0123456789abcdef0123456789abcdef', name => name.toLowerCase().replace(/[^a-z0-9]/g, ''));
}
describe('Display nickname presentation', () => {
 it('shows only the nickname and retains canonical identity and profile tooltip', () => {
  const watched = [], app = {watchUsernameColor: id => watched.push(id), displayNicknames: {fellnao: 'Fell'}};
  const log = load(app), html = log.accountName('FellNao');
  assert.match(html, /data-account-id="fellnao"/);
  assert.match(html, /data-account-name="FellNao"/);
  assert.match(html, /title="Account: @FellNao"/);
  assert.match(html, />Fell<\/span>$/);
  assert(!html.includes('Fell (@'));
  assert.deepEqual(watched, ['fellnao']);
 });
 it('escapes nicknames and keeps equal nicknames associated with different accounts', () => {
  const log = load({watchUsernameColor() {}, displayNicknames: {alice: '<img src=x>', bob: '<img src=x>'}});
  assert.match(log.accountName('Alice'), />&lt;img src=x&gt;<\/span>$/);
  assert.match(log.accountName('Alice'), /data-account-id="alice"/);
  assert.match(log.accountName('Bob'), /data-account-id="bob"/);
 });
 it('updates matchup labels without mutating canonical titles or player names', () => {
  const log = load({watchUsernameColor() {}, displayNicknames: {fellnao: 'Fell', leaf: 'Bot'}});
  const title = 'FellNao vs. Leaf';
  assert.equal(log.battleTitle(title, true), 'Fell vs. Bot');
  assert.equal(log.battleTitle('Team FellNao vs. Team Leaf', true), 'Team Fell vs. Team Bot');
  assert.match(log.battleTitle(title), />Fell<\/span> vs\. .*data-account-name="Leaf"/);
  assert.equal(title, 'FellNao vs. Leaf');
 });
 it('falls back after reset and leaves standalone replays and ordinary room titles unchanged', () => {
  const app = {watchUsernameColor() {}, displayNicknames: {fellnao: 'Fell'}}, log = load(app);
  delete app.displayNicknames.fellnao;
  assert.equal(log.accountNameText('FellNao'), 'FellNao');
  assert.equal(log.battleTitle('FellNao vs. Leaf', true), 'FellNao vs. Leaf');
  assert.equal(load().accountName('FellNao'), 'FellNao');
  assert.equal(log.battleTitle('Lobby <test>'), 'Lobby &lt;test&gt;');
 });
});
