'use strict';

module.exports = {
  searchResultData: async (ctx, next) => {
    try {
      let { query, page = 1, pageSize = 24 } = ctx.query;


      const searchCriteria  = {
        select: ["id", "title", "description"],
        populate: {
          main_image: { select: ["id", "url", "width", "height"] },
          tag: { select: ["id", "title"] },
          by: { select: ["id", "username"] }
        },
        offset: (page-1)*pageSize, limit: pageSize,
        orderBy: [{ title: 'asc' }, { publishedAt: 'desc' }]
      };

      if (query) {
        searchCriteria.where = {
          $or: [
            { title: { $containsi: query } },
            { tag: { title: { $containsi: query } } }
          ]
        };
      }

      // @ts-ignore
      const searchPosts = await strapi.db.query('api::post.post').findMany(searchCriteria);

      ctx.body = {
        searchPosts
      };
    } catch (err) {
      ctx.body = err;
    }
  }
};
