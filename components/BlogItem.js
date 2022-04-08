import React from 'react';
import Url from "./Url";


export default ({ blog }) => {
    let defaultImageUrl = Url('/blog.jpg');
    let style = { background: `url('${blog.image || defaultImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' };

    return (
        <li key={blog.id}>
            <a style={style} className="blog-item" href={blog.url}>
                <div className="blog-item--footer">
                    <div className="blog-item--footer--title">
                        {blog.title}
                    </div>
                    <div className="blog-item--footer--author">
                        {blog.author}
                    </div>
                </div>
            </a>
        </li>
    );
};