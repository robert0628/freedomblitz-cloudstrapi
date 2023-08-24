module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/landing-data',
     handler: 'landing-data.landingPageData',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
