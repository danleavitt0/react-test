var React = require('react');
var _ = require('lodash');

var CommentList = React.createClass({
  render: function() {
    var commentNodes = _.map(this.props.comments, function(comment, i){
      return (
        <div className="commentContainer" key={i}>
          <Comment author={comment.author}>
            {comment.text}
          </Comment>
          <LikeButton likes={comment.likes} _id={i} />
          <DeleteButton idx={i} _id={this.props._id} />
        </div>
      );
    }, this);
    return ( 
      <div className="commentList">
        {commentNodes}
      </div>
    )
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
    // console.log(this.props)
		io().emit('remove comment', this.props.idx, this.props._id);
	},
	render: function(){
		return(
    	<div className="option" onClick={this.handleClick}> Delete </div>
		)
	}
});

var LikeButton = React.createClass({
  handleClick:function(event){
    if(event.currentTarget.disabled === true)
      return
    else{
      // io().emit('add like', this.props._id);
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
    return {comments: []};
  },
  componentDidMount: function() {
    this.setState({comments:this.props.comments})
    io().on('added comment', function(data, id) {
      if (this.props._id === id)
        this.setState({comments:data});
    }.bind(this));
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentList comments={this.state.comments} _id={this.props._id} />
      </div>
    );
  }
});

module.exports = CommentBox;