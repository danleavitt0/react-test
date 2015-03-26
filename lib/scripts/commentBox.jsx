var React = require('react');

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, i){
      return (
        <div className="commentContainer" key={i}>
          <Comment author={comment.author}>
            {comment.text}
          </Comment>
          <div className="optionContainer">
            <LikeButton _id={i} likes={comment.likes}/>
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
  componentDidMount:function() {
    console.log(this, this.handleSubmit, this.props.onCommentSubmit);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log(e);
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
      <form onSubmit={this.handleSubmit} >
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
        </h3>
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
  handleClick:function(event){
    if(event.currentTarget.disbled === true)
      return
    else{
      io().emit('add like', this.props._id);
      event.currentTarget.disbled = true
    }
  },
  render: function(){
    var likes = this.props.likes || 0;
    return (
      <button className="option" onClick={this.handleClick}> Likes: {likes} </button>
    )
  }
})

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleCommentSubmit: function(comment) {
    console.log(comment);
    io().emit('new comment', comment, this.props._id);
  },
  componentDidMount: function() {
    this.setState({data:this.props.data})
    io().on('added comment', function(data) {
    	this.setState({data:data});
    }.bind(this));
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.state.data} />
      </div>
    );
  }
});

module.exports = CommentBox;

// var Comments = React.createClass({
//   getInitialState: function() {
//     return {data: []};
//   },
//   handleCommentSubmit: function(comment) {
//     io().emit('new comment', comment, this.props._id);
//   },
//   getDataFromServer: function(){
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   componentDidMount: function() {
//     this.getDataFromServer();
//     this.setState({data:this.props.data})
//     io().on('added comment', function(data) {
//       this.setState({data:data});
//     }.bind(this));
//   },
//   render: function() {
//     return (
//       <div className="commentBox">
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//         <CommentList data={this.state.data} />
//       </div>
//     );
//   }
// });

// function render(){
//   return <Comments url="comments.json"/>
// }

// module.exports = render;