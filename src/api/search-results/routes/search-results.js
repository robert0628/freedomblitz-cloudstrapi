module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/search-results',
     handler: 'search-results.searchResultData',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
