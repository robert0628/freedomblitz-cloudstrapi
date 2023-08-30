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
            { tag: { title: { $containsi: query } } },
            { by: { username:  { $containsi : query }}}
          ]
        };
      }

      // @ts-ignore
      const data = await strapi.db.query('api::post.post').findWithCount(searchCriteria);

      let editorPicks = []
      if(!data?.[0]?.length) {
        editorPicks = await strapi.entityService.findMany('api::editor-pick.editor-pick', {
          populate: ['post.main_image', 'post.by', 'post.tag']
        })
      }

      ctx.body = {
        searchedPosts : data[0],
        totalPosts: data[1],
        editorPicks
      };
    } catch (err) {
      ctx.body = err;
    }
  }
};
