// import React from 'react';
// import ReactDOM from 'react-dom';
// import axios from "axios";

const BlogComments = () => {
    const [comments, setComment] = React.useState([]);
    
    const {pathname} = window.location;

    fetch(`/comments?slug=${pathname}`).then(r => r.json()).then(r => {
        // comments = r;
        setComment(r);
    });

    function submitComment() {
        var textarea = document.getElementById('comment-blog');
        var text = textarea.value;
        var body = JSON.stringify({comment: text});


        fetch("/comments?slug=" + pathname, {
            
            // Adding method type
            method: "POST",
            
            // Adding body or contents to send
            body,
            
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        
        // Converting to JSON
        .then(response => response.json())
        
        // Displaying results to console
        .then(json => console.log(json));


    }

    return (
        <div>
            <h1>Comments</h1>
            {comments.map(c => (<div>{c.comment}</div>))}

            <textarea id="comment-blog"></textarea>
            <button onClick={submitComment}>Submit</button>
        </div>
    );
}

ReactDOM.render(
  <BlogComments />,
  document.querySelector('#comments')
);

