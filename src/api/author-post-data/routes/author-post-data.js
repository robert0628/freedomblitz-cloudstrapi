module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/author-post-data/:id',
     handler: 'author-post-data.getAuthorWithPosts',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
