'use strict';
const ts=require('typescript');
exports.assignment=function(source,name,marker){
 const matches=[];
 const visit=node=>{if(ts.isBinaryExpression(node)&&node.operatorToken.kind===ts.SyntaxKind.EqualsToken&&node.left.getText()===name&&ts.isFunctionExpression(node.right)){const text=node.right.getText();if(!marker||text.includes(marker))matches.push(text);}ts.forEachChild(node,visit);};
 visit(ts.createSourceFile('source.js',source,ts.ScriptTarget.Latest,true));
 if(!matches.length)throw Error('No function assignment '+name+' '+(marker||''));
 return matches[matches.length-1];
};
