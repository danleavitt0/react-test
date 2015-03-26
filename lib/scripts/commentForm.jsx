var React = require('react');

var CommentForm = React.createClass({
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
    // console.log(this.getDOMNode())
    return (
      <form onSubmit={this.handleSubmit} >
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" />
      </form>
    );
  }
});

function render() {
  return <CommentForm />
}

module.exports = CommentForm;