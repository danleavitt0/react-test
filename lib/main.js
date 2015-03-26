var React = require('react');
var view = require('./scripts/post.jsx');
var commentForm = require('./scripts/commentForm.jsx');
window.React = require("react");

$(document).ready(function(){
	React.render(view(), document.getElementById('content'));
	// React.render(commentForm(), document.getElementById('content'));
	// React.render(comment(), document.getElementById('content'));
}) 