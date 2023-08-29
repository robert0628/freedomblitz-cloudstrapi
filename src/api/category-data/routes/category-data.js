module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/category-data',
     handler: 'category-data.categoryData',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
