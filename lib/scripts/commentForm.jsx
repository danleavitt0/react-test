var React = require('react');

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, body: text, _id:this.props._id});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = ''; 
    return;
  },
  handleChange: function() {
  },
  handleFocus: function() {
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange} onFocus={this.handleFocus}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" />
      </form>
    );
  }
});

module.exports = CommentForm;