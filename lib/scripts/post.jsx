var React = require('react');
var CommentForm = require('./commentForm.jsx');
var CommentBox = require('./commentBox.jsx')
var _ = require('lodash');

var PostList = React.createClass({
  render: function(){
    var postNodes = _.map(this.props.posts, function(post, idx){
      return (
        <div key={idx}>
          <Post img={post.img} heading={post.header} content={post.content} />
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

var Posts = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  handleCommentSubmit: function(comment) {
    io().emit('new comment', comment, this.props._id);
  },
  getDataFromServer: function(){
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
  componentDidMount: function() {
    this.getDataFromServer();
  },
  render: function() {
    return (
      <div className="commentBox">
        <PostList posts={this.state.data} handleCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

function render(){
  return <Posts url="posts.json" />
}

module.exports = render;