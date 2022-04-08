import _ from 'lodash';
import state from '../components/globalState';

export function setGlobalState(organisations) {
    state.setState('orgs', organisations);

    const allBlogs = [];
    organisations.forEach(org => {
        org.authors.forEach(author => {
            author.blogs.forEach(blog => {
                var _blog = { ...blog };
                delete _blog.SEO;
                delete _blog.html;

                allBlogs.push({
                    ..._blog,
                    author_id: author.id,
                    author_name: author.name,
                    link: `/${org.id}/${author.id}/${blog.id}`,
                    org_id: org.id,
                    org_name: org.name
                });
            });
        });
    });

    var orderedBlogs = _.orderBy(allBlogs, ['date_real', 'name'], ['desc', 'asc']);
    state.setState('all_blogs', orderedBlogs);
    state.setState('authors', organisations.map(org => org.authors).flat(1));
}

export function getAllTags() {
    let orderedBlogs = state.getState('all_blogs');
    // get all of the tags in the blogs
    var tags = [];
    orderedBlogs.forEach(blog => {
        blog.tags.forEach(tag => {
            let capitalizedTag = _.capitalize(tag);
            if (!tags.includes(capitalizedTag)) {
                tags.push(capitalizedTag);
            }
        });
    });
    state.setState('tags', tags);
    return state.getState('tags');
}

