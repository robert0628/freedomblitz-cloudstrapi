'use strict';

/**
 * A set of functions called "actions" for `category-data`
 */

module.exports = {
  categoryData: async (ctx, next) => {
    try {
      let { category, page = 1, pageSize = 24 } = ctx.query;
      const tags = await strapi.entityService.findMany('api::tag.tag', {
        populate: ['parent']
      })
      category = category.split('-').join(' ')
      const { rows: posts } = await strapi.db.connection.raw(`
        SELECT 
          pp.id, 
          pp.title, 
          JSON_BUILD_OBJECT('title', pt.title, 'id', pt.id) as tag,
          JSON_BUILD_OBJECT('username', pup.username, 'id', pup.id) as by,
          JSON_BUILD_OBJECT('url', pf.url, 'width', pf.width, 'height', pf.height) as main_image
        FROM public.posts pp
        JOIN public.posts_tag_links ptl ON pp.id = ptl.post_id
        JOIN public.tags pt ON ptl.tag_id = pt.id
        JOIN public.posts_by_links ppbl ON ppbl.post_id = pp.id
        JOIN public.up_users pup ON pup.id = ppbl.user_id
        JOIN public.files_related_morphs pfrm ON pfrm.related_id = pp.id
        JOIN public.files pf ON pf.id = pfrm.file_id
        GROUP BY pp.id, pt.title, pup.username, pf.url, pf.width, pf.height, pt.id, pup.id
        HAVING LOWER(pt.title) LIKE ? OR (
          SELECT LOWER(title) FROM public.tags ptt WHERE ptt.id = (
            SELECT inv_tag_id FROM public.tags_parent_links WHERE tag_id = pt.id
          )
        ) LIKE ?
        LIMIT ? OFFSET ?
      `, [category, category, pageSize, (page - 1)*pageSize])
      ctx.body = {
        posts,
        tags,
      };
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
