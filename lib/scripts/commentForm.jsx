var React = require('react');

var CommentForm = React.createClass({
  componentDidMount: function() {
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log(e);
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    // this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  handleChange: function() {
    console.log('change');
  },
  handleFocus: function() {
    console.log('focus');
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