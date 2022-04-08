import url from "../Url";
import BaseModel from './BaseModel';

class Blog extends BaseModel {

    get imageUrl() {
        return this.data.image ? url(`${this.data.url}${this.data.image}`) : url('/blog.jpg');
    }

    get url() {
        return url(this.data.url);
    }

}

export default Blog;