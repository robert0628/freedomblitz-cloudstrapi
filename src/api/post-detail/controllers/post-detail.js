'use strict';

/**
 * A set of functions called "actions" for `post-detail`
 */

module.exports = {
  postDetail: async (ctx, next) => {
    try {
      const { id } = ctx.params
      const post = await strapi.db.query('api::post.post').findOne({
        where: {id},
        populate: ['main_image', 'by.image', 'tag', 'contributors.image', 'accordian.qas', 'boxed_content.content'],
      });

      const latestPosts = await strapi.entityService.findMany('api::post.post', {
        fields: ['title'],
        populate: {
          tag: true,
          by: true,
          main_image: true
        },
        limit: 6,
        sort: [{ title: 'asc' }, { publishedAt: 'desc' }]
      })
      const topPicks = await strapi.entityService.findMany('api::top-pick.top-pick', {
        populate: ['post.main_image', 'post.by.image', 'post.tag'],
      });
      const { rows: relatedPosts } = await strapi.db.connection.raw(`
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
        WHERE similarity(pp.title, (SELECT title FROM public.posts WHERE id = ?)) > 0.5
        GROUP BY pp.id, pt.title, pup.username, pf.url, pf.width, pf.height, pt.id, pup.id
        ORDER BY similarity(pp.title, (SELECT title FROM public.posts WHERE id = ?)) desc
        LIMIT 6
      `, [id, id])
      const details = await strapi.db.query('api::post.post').findMany({
        where: {
          id,
        },
        // @ts-ignore
        populate: { bottom_media: true }
      })
      ctx.body = {
        post,
        latestPosts,
        topPicks,
        relatedPosts,
        details: details?.[0]
      }
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
