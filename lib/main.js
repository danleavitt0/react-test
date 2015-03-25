var React = require('react');
var view = require('./scripts/post.jsx');

$(document).ready(function(){
	React.render(view(), document.getElementById('content'));
}) 