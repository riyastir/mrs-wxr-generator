'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require('assert');
var xmlbuilder = require('xmlbuilder');

var rId = function rId() {
  return Math.floor(Math.random() * 100000);
};
module.exports = function () {
  /**
   * name: site name
   * url: site url
   * description: site description
   * language: site language, default is en-US
   * base_site_url: same as url
   * base_blog_url: same as url
   */
  function Generator(_ref) {
    var name = _ref.name,
        url = _ref.url,
        description = _ref.description,
        _ref$language = _ref.language,
        language = _ref$language === undefined ? 'en-US' : _ref$language,
        base_site_url = _ref.base_site_url,
        base_blog_url = _ref.base_blog_url;
    (0, _classCallCheck3.default)(this, Generator);

    base_site_url = base_site_url || url;
    base_blog_url = base_blog_url || url;

    this.xml = xmlbuilder.create('rss').att('xmlns:excerpt', 'http://wordpress.org/export/1.2/expert').att("xmlns:content", "http://purl.org/rss/1.0/modules/content/").att("xmlns:wfw", "http://wellformedweb.org/CommentAPI/").att("xmlns:dc", "http://purl.org/dc/elements/1.1/").att("xmlns:wp", "http://wordpress.org/export/1.2/").att("version", "2.0");
    this.channel = this.xml.ele('channel');
    this.channel.ele('wp:wxr_version', {}, 1.2);
    this.channel.ele('title', {}, name);
    this.channel.ele('link', {}, url);
    this.channel.ele('description', {}, description);
    this.channel.ele('language', {}, language);
    this.channel.ele('wp:base_site_url', {}, base_site_url);
    this.channel.ele('wp:base_blog_url', {}, base_blog_url);
    this.channel.ele('generator', {}, 'https://npmjs.com/wxr-generator');
  }

  /**
   * id: post Id, if not provied, random ID will be generated.
   * url: post permalink url.
   * slug: post slug name if it exists.
   * date: post create time.
   * title: post title.
   * author: post author, it equals author's login name.
   * content: post content
   * summary: post summary
   * comment_status: post comment status, default is `open`, it can be `open` or `close`.
   * ping_status: post ping status, default is `open`, it can be `open` or `close`.
   * password: post visit password if it should, default is empty.
   * categories: post categories, it's an array item. Every item should has `slug` and `name` prototype.
   * tags: post tags, it's an array item. Every item should has `slug` and `name` prototype.
  */


  (0, _createClass3.default)(Generator, [{
    key: 'addPost',
    value: function addPost(_ref2) {
      var _ref2$id = _ref2.id,
          id = _ref2$id === undefined ? rId() : _ref2$id,
          url = _ref2.url,
          slug = _ref2.slug,
          date = _ref2.date,
          title = _ref2.title,
          author = _ref2.author,
          content = _ref2.content,
          summary = _ref2.summary,
          _ref2$comment_status = _ref2.comment_status,
          comment_status = _ref2$comment_status === undefined ? 'open' : _ref2$comment_status,
          _ref2$ping_status = _ref2.ping_status,
          ping_status = _ref2$ping_status === undefined ? 'open' : _ref2$ping_status,
          _ref2$status = _ref2.status,
          status = _ref2$status === undefined ? 'publish' : _ref2$status,
          _ref2$type = _ref2.type,
          type = _ref2$type === undefined ? 'post' : _ref2$type,
          _ref2$password = _ref2.password,
          password = _ref2$password === undefined ? '' : _ref2$password,
          categories = _ref2.categories,
          tags = _ref2.tags,
          image = _ref2.image,
          postMeta = _ref2.postMeta;
        
      var post = this.channel.ele('item');
      post.ele('title', {}, title);
      post.ele('link', {}, url);
      post.ele('pubDate', {}, date);
      post.ele('dc:creator').cdata(author);
      post.ele('guid', { isPermaLink: true }, slug);
      post.ele('description').cdata(summary);
      post.ele('content:encoded').cdata(content);
      post.ele('excerpt:encoded').cdata(summary);
      post.ele('wp:post_id', {}, id);
      post.ele('wp:post_date').cdata(date);
      post.ele('wp:comment_status').cdata(comment_status);
      post.ele('wp:ping_status').cdata(ping_status);
      post.ele('post_name').cdata(title);
      post.ele('wp:status').cdata(status);
      post.ele('wp:post_parent', {}, 0);
      post.ele('wp:menu_order', {}, 0);
      post.ele('wp:post_type', {}, type);
      post.ele('wp:post_password').cdata(password);
      post.ele('wp:is_sticky', {}, 0);
      if (Array.isArray(categories)) {
        categories.forEach(function (cate) {
          return post.ele('category', {
            domain: 'category',
            nicename: cate.slug
          }).cdata(cate.name);
        });
      }
      if (Array.isArray(tags)) {
        tags.forEach(function (tag) {
          return post.ele('category', {
            domain: 'category',
            nicename: tag.slug
          }).cdata(tag.name);
        });
      }
      if(postMeta){
        postMeta.map((meta)=>{
          return  post.ele({
            'wp:postmeta': [{
              'wp:meta_key': meta.key,
              'wp:meta_value': meta.value
            }]
          });
        })
      }
      if (image) {
        post.ele({
          'wp:postmeta': [{
            'wp:meta_key': '_thumbnail_id',
            'wp:meta_value': image
          }]
        });
      }
    }
  }, {
    key: 'addPage',
    value: function addPage(page) {
      page.type = 'page';
      this.addPost(page);
    }

    /**
     * id: user Id
     * username: user login name
     * email: user email
     * display_name: user nickname
     * first_name: user first name
     * last_name: user last name
     */

  }, {
    key: 'addUser',
    value: function addUser(_ref3) {
      var _ref3$id = _ref3.id,
          id = _ref3$id === undefined ? rId() : _ref3$id,
          username = _ref3.username,
          email = _ref3.email,
          display_name = _ref3.display_name,
          _ref3$first_name = _ref3.first_name,
          first_name = _ref3$first_name === undefined ? '' : _ref3$first_name,
          _ref3$last_name = _ref3.last_name,
          last_name = _ref3$last_name === undefined ? '' : _ref3$last_name;

      var user = this.channel.ele('wp:author');
      user.ele('wp:author_id', {}, id);
      user.ele('wp:author_login', {}, username);
      user.ele('wp:author_email', {}, email);
      user.ele('wp:author_display_name', {}, display_name || username);
      user.ele('wp:author_first_name', {}, first_name);
      user.ele('wp:author_last_name', {}, last_name);
    }

    /**
     * id: tag Id, if not provied, random ID will be generated.
     * slug: tag slug. Used in URLS, e.g. "js-rocks"
     * name: tag title, e.g. "JS"
     * description: tag description string, default is empty.
     */

  }, {
    key: 'addTag',
    value: function addTag(_ref4) {
      var _ref4$id = _ref4.id,
          id = _ref4$id === undefined ? rId() : _ref4$id,
          slug = _ref4.slug,
          name = _ref4.name,
          _ref4$description = _ref4.description,
          description = _ref4$description === undefined ? '' : _ref4$description;

      var tag = this.channel.ele('wp:tag');
      tag.ele('wp:term_id', {}, id || Math.floor(Math.random() * 100000));
      tag.ele('wp:tag_slug', {}, slug);
      tag.ele('wp:tag_name', {}, name);
      tag.ele('wp:tag_description', {}, description);
    }

    /**
     * id: category Id. If not provided, random ID will be generated.
     * slug: category slug. Used in URLS, e.g. "js-rocks"
     * name: category title, e.g. "Everything about JS"
     * parent_id: category parent id if it existed.
     * description: category description string, default is empty.
    */

  }, {
    key: 'addCategory',
    value: function addCategory(_ref5) {
      var _ref5$id = _ref5.id,
          id = _ref5$id === undefined ? rId() : _ref5$id,
          slug = _ref5.slug,
          name = _ref5.name,
          _ref5$parent_id = _ref5.parent_id,
          parent_id = _ref5$parent_id === undefined ? 0 : _ref5$parent_id,
          _ref5$description = _ref5.description,
          description = _ref5$description === undefined ? '' : _ref5$description;

      var category = this.channel.ele('wp:category');
      category.ele('wp:term_id', {}, id);
      category.ele('wp:category_nicename', {}, slug);
      category.ele('wp:cat_name', {}, name);
      category.ele('wp:category_description', {}, '');
      if (parent_id) {
        category.ele('wp:category_parent', {}, parent_id);
      }
    }

    /**
     * id: attachment Id. If not provided, random ID will be generated.
     * url: attachment absolute url.
     * date: attachment create time.
     * file: attachment relative path if it exist.
     * title: attachment title.
     * author: attachment uploader.
     * description: attachment description.
     * post_id: post id relate to the attachment.
     * meta_data: other serialized attach meta data.
     */

  }, {
    key: 'addAttachment',
    value: function addAttachment(_ref6) {
      var _ref6$id = _ref6.id,
          id = _ref6$id === undefined ? rId() : _ref6$id,
          url = _ref6.url,
          date = _ref6.date,
          file = _ref6.file,
          title = _ref6.title,
          author = _ref6.author,
          _ref6$description = _ref6.description,
          description = _ref6$description === undefined ? '' : _ref6$description,
          post_id = _ref6.post_id,
          _ref6$comment_status = _ref6.comment_status,
          comment_status = _ref6$comment_status === undefined ? 'close' : _ref6$comment_status,
          _ref6$ping_status = _ref6.ping_status,
          ping_status = _ref6$ping_status === undefined ? 'close' : _ref6$ping_status,
          meta_data = _ref6.meta_data;

      author = author || 'admin';
      comment_status = comment_status || 'open';
      ping_status = ping_status || 'closed';

      var attach = this.channel.ele('item');
      attach.ele('title', {}, title);
      attach.ele('link', {}, url);
      attach.ele('pubDate', {}, date);
      attach.ele('dc:creator').cdata(author);
      attach.ele('description').cdata(description);
      attach.ele('content:encoded').cdata(description);
      attach.ele('excerpt:encoded').cdata(description);
      attach.ele('wp:post_id', {}, id);
      attach.ele('wp:post_date').cdata(date);
      attach.ele('wp:comment_status').cdata(comment_status);
      attach.ele('wp:ping_status').cdata(ping_status);
      attach.ele('wp:post_name').cdata(title);
      attach.ele('wp:status').cdata('inherit');
      attach.ele('wp:post_parent', {}, post_id);
      attach.ele('wp:menu_order', {}, 0);
      attach.ele('wp:post_type', {}, 'attachment');
      attach.ele('wp:post_password').cdata('');
      attach.ele('wp:is_sticky', {}, 0);
      attach.ele('wp:attachment_url').cdata(url);
      attach.ele({
        'wp:postmeta': [{
          'wp:meta_key': '_wp_attached_file',
          'wp:meta_value': file
        }, {
          'wp:meta_key': '_wp_attachment_metadata',
          'wp:meta_value': meta_data
        }, {
          'wp:meta_key': '_wp_attachment_image_alt',
          'wp:meta_value': title
        }]
      });
    }

    /** TODO */

  }, {
    key: 'addComment',
    value: function addComment() {}
  }, {
    key: 'stringify',
    value: function stringify() {
      return this.xml.end({
        pretty: false,
        indent: "    ",
        newline: "\n"
      });
    }
  }]);
  return Generator;
}();