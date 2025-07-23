// Example for Express routes
import { likePost, unlikePost } from '../Controller/LikeController.js';
import express from 'express';
import verifyToken from '../../auth/middleware/jwtmiddleware.js';

const LikesRouter = express.Router();
LikesRouter.post('/', verifyToken, likePost);
LikesRouter.delete('/', verifyToken, unlikePost);

export default LikesRouter;