const connection = require('../../database/connection');
const fs = require('fs');

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;
    const itemsPerPage = 6;

    const [count] = await connection('posts').count();

    const posts = await connection('posts')
      .join('users', 'users.id', '=', 'posts.author')
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage)
      .select('posts.*', 'users.name', 'users.picture');

    res.header('X-Total-Count', count['count(*)']);
    return res.json(posts);
  },

  async read(req, res) {
    try {
      const { slug } = req.params;
      let postInfo = await connection('posts')
        .join('users', 'users.id', '=', 'posts.author')
        .first()
        .where('slug', slug)
        .select('posts.*', 'users.name', 'users.picture');

      if (!fs.existsSync(`public/posts/${slug}/${slug}.md`)) {
        return res.status(404).send();
      }
      postInfo.postURL = `${process.env.HOST}:${process.env.PORT}/posts/${slug}/${slug}.md`;
      return res.json({ postInfo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    const { title, author, description, image, slug } = req.body;
    const token = req.headers.authorization;
    const [postId] = await connection('posts').insert({
      title,
      description,
      image,
      slug,
      author,
    });
    res.status(201).json({ postId });
  },
  async delete(req, res) {
    const { id } = req.params;
    const token = req.headers.authorization;

    const post = await connection('posts')
      .where('id', id)
      .select('author')
      .first();

    if (post.author !== id)
      return res.status(401).json({ error: 'Operation not permitted' });
    await connection('posts').where('id', id).delete('*');
    return res.status(204).send();
  },
};
