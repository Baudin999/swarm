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
    var orderedBlogs = _.orderBy(allBlogs, ['date'], ['desc']);
    state.setState('all_blogs', orderedBlogs);
    state.setState('authors', organisations.map(org => org.authors).flat(1));
}