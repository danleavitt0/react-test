var React = require('react');
var view = require('./scripts/post.jsx');
// var comment = require('./scripts/commentBox.jsx');

$(document).ready(function(){
	React.render(view(), document.getElementById('content'));
	// React.render(comment(), document.getElementById('content'));
}) 