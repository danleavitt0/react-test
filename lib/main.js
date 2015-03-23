var React = require('react');
var view = require('./scripts/example.jsx');

$(document).ready(function(){
	React.render(view(), document.getElementById('content'));
})
console.log(document.getElementById('content'));
// 