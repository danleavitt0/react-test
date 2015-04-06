var React = require('React');
var CommentBox = require('./commentBox.jsx');
var CommentForm = require('./commentForm.jsx');
var _ = require('lodash');

var PostList = React.createClass({
	handleSubmit: function() {
		console.log('handle click');
	},
	render:function(){
		console.log(this.props.posts);
		var postNodes = _.map(this.props.posts, function(post, i){
			return (
				<div className="postContainer" key={i}>
					<Post img={post.img} heading={post.header} content={post.content} />
					<CommentForm />
					<CommentBox comments={post.comments} />
				</div>
			);
		}, this);
		return (
			<div className="postList">
				{postNodes}
			</div>
		);
	}
});

var Post = React.createClass({
	render:function(){
		return(
			<div className="post">
				<h2 className="postHeading">{this.props.heading}</h2>
				<div className="postContent">{this.props.content}</div>
			</div>
		);
	}
})

var PostForm = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		console.log(e);
	},
	render: function(){
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text"  />
				<input type="text" />
				<input type="text"  />
				<input type="submit" />
			</form>
		);
	}
})

var PostBox = React.createClass({
	getInitialState: function() {
		return {
			posts:[] 
		};
	},
	componentDidMount: function() {
		this.loadPostsFromServer();
    io().on('added comment', function(data) {
      this.setState({posts:data});
    }.bind(this));
	},
	loadPostsFromServer: function() {
		$.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({posts: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},
	render:function(){
		return (
			<div className="postBox">
				<PostList posts={this.state.posts} />
			</div>
		);
	}
})

function render() {
	return <PostBox url="posts.json" />
}

module.exports = render;