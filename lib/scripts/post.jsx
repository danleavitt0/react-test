var React = require('react');
var CommentForm = require('./commentForm.jsx');
var CommentBox = require('./commentBox.jsx')
var _ = require('lodash');

var PostList = React.createClass({
  render: function(){
    var postNodes = _.map(this.props.posts, function(post, idx){
      return (
        <div key={idx}>
          <Post img={post.img} heading={post.author} content={post.body} />
          <CommentForm onCommentSubmit={this.props.handleCommentSubmit} _id={post._id}/>
          <CommentBox comments={post.comments} _id={post._id} />
        </div>
      )
    }, this);
    return (
      <div className="posts">
        {postNodes}
      </div>
    )
  }
})

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
  handleSubmit: function(post) {
    io().emit('new post', post);
    this.props.handleSubmit(post);
  },
  render: function(){
    return(
      <CommentForm onCommentSubmit={this.handleSubmit}/>
    );
  }
})

var Posts = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  handleCommentSubmit: function(comment) {
    io().emit('new comment', comment, this.props._id);
  },
  handlePostSubmit: function(post) {
    var posts = this.state.data;
    var newPosts = posts.concat([post]);
    this.setState({data:newPosts});
  },
  getDataFromServer: function(){
    io().emit('retrieve posts')
  },
  componentDidMount: function() {
    this.getDataFromServer();
    io().on('post list', function(data){
      this.setState({data:data});
    }.bind(this))
  },
  render: function() {
    return (
      <div className="postBox">
        <PostForm handleSubmit={this.handlePostSubmit} />
        <PostList posts={this.state.data} handleCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

function render(){
  return <Posts url="posts.json" />
}

module.exports = render;