var React = require('React');
var CommentBox = require('./commentBox.jsx');

var PostList = React.createClass({
	render:function(){
		var postNodes = this.props.data.map(function(post, i){
			console.log(post);
			return (
				<div className="postContainer">
					<Post img={post.img} heading={post.header} content={post.content} />
				</div>
			);
		});
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
				<div>{this.props.img}</div>
				<h2 className="postHeading">{this.props.heading}</h2>
				<div className="postContent">{this.props.content}</div>
			</div>
		);
	}
})

var PostBox = React.createClass({
	getInitialState: function() {
		return {
			data:[] 
		};
	},
	componentDidMount: function() {
		this.loadPostsFromServer();
	},
	loadPostsFromServer: function() {
		$.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},
	render:function(){
		return (
			<div className="postBox">
				<PostList data={this.state.data} />
			</div>
		)
	}
})

function render() {
	return <PostBox url="posts.json" />
}

module.exports = render;