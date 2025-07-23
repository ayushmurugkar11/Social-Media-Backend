import LikeModel from '../Models/likes.js';

export const addLike = async (userId, postId) => {
  const existing = await LikeModel.findOne({
    user: userId,
    targetType: 'Post',
    targetId: postId,
  });
  if (existing) {
    throw new Error('User has already liked this post');
  }
  return await LikeModel.create({
    user: userId,
    targetType: 'Post',
    targetId: postId,
  });
};

export const removeLike = async (userId, postId) => {
  const existing = await LikeModel.findOne({
    user: userId,
    targetType: 'Post',
    targetId: postId,
  });
  if (!existing) {
    throw new Error('Like does not exist');
  }
  return await LikeModel.deleteOne({
    user: userId,
    targetType: 'Post',
    targetId: postId,
  });
};