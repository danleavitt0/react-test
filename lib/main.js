var React = require('react');
var comment = require('./scripts/post.jsx');
var commentForm = require('./scripts/commentForm.jsx');
// window.React = require("react");

$(document).ready(function(){
	// React.render(commentForm(), document.getElementById('content'));
	React.render(comment(), document.getElementById('container'));
}) 