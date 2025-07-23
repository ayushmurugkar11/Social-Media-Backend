import { addLike, removeLike } from '../Repository/likeRepository.js';

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
      const { postId } = req.body;
      console.log('here are we', postId)
    await addLike(userId, postId);
    res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    if (err.message === 'User has already liked this post') {
      res.status(409).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

export const unlikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.body;
    await removeLike(userId, postId);
    res.status(200).json({ message: 'Post unliked' });
  } catch (err) {
    if (err.message === 'Like does not exist') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};