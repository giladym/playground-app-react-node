import { BaseRepository } from './base.repository';
import { CommentModel, CommentDocument } from '../models/comment.model';
import { Types, UpdateQuery } from 'mongoose';
import { CreateCommentRequest, UpdateCommentRequest } from '../interfaces/comment.interface';

export class CommentRepository extends BaseRepository<CommentDocument> {
  constructor() {
    super(CommentModel);
  }

  async findByFeature(featureId: string): Promise<CommentDocument[]> {
    return this.find({ featureId: new Types.ObjectId(featureId) });
  }

  async findByUser(userId: string): Promise<CommentDocument[]> {
    return this.find({ userId: new Types.ObjectId(userId) });
  }

  async toggleSolution(id: string): Promise<CommentDocument | null> {
    const comment = await this.findById(id);
    if (!comment) return null;
    
    return super.update(id, {
      isApprovedSolution: !comment.isApprovedSolution
    });
  }

  async toggleLike(id: string, userId: string): Promise<CommentDocument | null> {
    const comment = await this.findById(id);
    if (!comment) return null;

    const userObjectId = new Types.ObjectId(userId);
    const likes = comment.likes || [];
    const userLikeIndex = likes.findIndex(id => id.equals(userObjectId));
    
    if (userLikeIndex === -1) {
      likes.push(userObjectId);
    } else {
      likes.splice(userLikeIndex, 1);
    }
    
    return super.update(id, { likes } as UpdateQuery<CommentDocument>);
  }

  async createComment(data: CreateCommentRequest): Promise<CommentDocument> {
    const commentData = {
      featureId: new Types.ObjectId(data.featureId),
      userId: new Types.ObjectId(data.userId),
      parentCommentId: data.parentCommentId ? new Types.ObjectId(data.parentCommentId) : undefined,
      content: data.content,
      isApprovedSolution: false,
      likes: []
    };
    return this.create(commentData);
  }

  override async update(id: string, data: UpdateCommentRequest): Promise<CommentDocument> {
    return super.update(id, data as UpdateQuery<CommentDocument>);
  }
} 