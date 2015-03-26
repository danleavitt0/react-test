var React = require('react');

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, i){
      return (
        <div className="commentContainer">
          <Comment author={comment.author}>
            {comment.text}
          </Comment>
          <div className="optionContainer">
          	<LikeButton _id={i}/>
            <LikeCounter likes={comment.likes} />
            <DeleteButton _id={i}/>
          </div>
        </div>
      );
    });
    return ( 
      <div className="commentList">
        {commentNodes}
      </div>
    )
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

var DeleteButton = React.createClass({
	handleClick:function(event){
		io().emit('remove comment', this.props._id);
	},
	render: function(){
		return(
    	<div className="option" onClick={this.handleClick}> Delete </div>
		)
	}
});

var LikeButton = React.createClass({
	componentDidMount: function(){
		this.like = 'Like';
	},
	handleClick: function() {
	  io().emit(this.like, this.props._id);
	  this.like = this.like === 'Like' ? 'Unlike' : 'Like';
  },
  render: function() {
  	var like = this.like || 'Like';
  	return (
  		<button className="option" onClick={this.handleClick}> {like} </button>
		)
  }
})

var LikeCounter = React.createClass({
  render: function(){
    var likes = this.props.likes || 0;
    return (
      <div className="option"> Likes: {likes} </div>
    )
  }
})

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
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
  handleCommentSubmit: function(comment) {
    io().emit('new comment', comment);
  },
  componentDidMount: function() {
  	this.loadCommentsFromServer();
    io().on('added comment', function(data) {
    	this.setState({data:data});
    }.bind(this));
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.state.data} />
      </div>
    );
  }
});

function render() {
	return <CommentBox url="comments.json"/>
}

var name = "example";
module.exports = render;