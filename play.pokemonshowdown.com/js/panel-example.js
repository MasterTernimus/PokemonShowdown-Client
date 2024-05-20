function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;_setPrototypeOf(subClass,superClass);}function _setPrototypeOf(o,p){_setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){o.__proto__=p;return o;};return _setPrototypeOf(o,p);}/**
 * Example Panel
 *
 * Just an example panel for creating new panels/popups
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var



ExampleRoom=function(_PSRoom){

function ExampleRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='example';return _this;
}_inheritsLoose(ExampleRoom,_PSRoom);return ExampleRoom;}(PSRoom);var


ExamplePanel=function(_PSRoomPanel){function ExamplePanel(){return _PSRoomPanel.apply(this,arguments)||this;}_inheritsLoose(ExamplePanel,_PSRoomPanel);var _proto=ExamplePanel.prototype;_proto.
render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"mainmessage"},preact.h("p",null,"Loading..."))
);
};return ExamplePanel;}(PSRoomPanel);


PS.roomTypes['example']={
Model:ExampleRoom,
Component:ExamplePanel
};var



ExampleViewPanel=function(_PSRoomPanel2){function ExampleViewPanel(){return _PSRoomPanel2.apply(this,arguments)||this;}_inheritsLoose(ExampleViewPanel,_PSRoomPanel2);var _proto2=ExampleViewPanel.prototype;_proto2.
render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"mainmessage"},preact.h("p",null,"Loading..."))
);
};return ExampleViewPanel;}(PSRoomPanel);


PS.roomTypes['exampleview']={
Component:ExampleViewPanel
};
//# sourceMappingURL=panel-example.js.map