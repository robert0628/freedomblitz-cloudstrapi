module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/post-detail/:id',
     handler: 'post-detail.postDetail',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
