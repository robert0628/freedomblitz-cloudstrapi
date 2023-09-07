module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/search-suggestions',
     handler: 'search-suggestions.searchSuggestions',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
