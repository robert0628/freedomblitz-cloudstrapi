'use strict';

module.exports = {
  searchResultData: async (ctx, next) => {
    try {
      let { query, page = 1, pageSize = 24 } = ctx.query;

      const searchCriteria = {
        fields: ['title'],
        populate: {
          tag: true,
          by: true,
          main_image: true
        },
        start: (page-1)*pageSize, limit: pageSize,
        sort: [{ title: 'asc' }, { publishedAt: 'desc' }]
      };

      if (query) {
    
        searchCriteria.where = {
          title : {
            $containsi: query,
          },
        };
      }

      const searchPosts = await strapi.db.query('api::post.post').findMany(searchCriteria);

      ctx.body = {
        searchPosts
      };
    } catch (err) {
      ctx.body = err;
    }
  }
};
