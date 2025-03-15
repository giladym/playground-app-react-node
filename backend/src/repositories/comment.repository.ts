import { BaseRepository } from './base.repository';
import { Comment } from '../interfaces/comment.interface';
import { CommentModel, CommentDocument } from '../models/comment.model';
import { Types, UpdateQuery, ClientSession } from 'mongoose';
import { CreateCommentRequest, UpdateCommentRequest } from '../interfaces/comment.interface';
import { DatabaseError } from '../utils/errors';

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
    } as UpdateQuery<CommentDocument>);
  }

  async toggleLike(id: string, userId: string): Promise<CommentDocument | null> {
    const userObjectId = new Types.ObjectId(userId);
    
    // Start a session for the transaction
    const session = await this.model.db.startSession();
    
    try {
      let result: CommentDocument | null = null;
      
      // Start transaction
      await session.withTransaction(async () => {
        // First try to remove the like
        const comment = await this.model.findByIdAndUpdate(
          id,
          { $pull: { likes: userObjectId } },
          { new: true, session }
        );

        if (!comment) {
          throw new Error('Comment not found');
        }

        // If likes array length didn't change, user hadn't liked it before, so add the like
        const originalLikesCount = comment.likes.length;
        
        if (originalLikesCount === comment.likes.length) {
          // Add the like since pull didn't remove anything
          result = await this.model.findByIdAndUpdate(
            id,
            { $push: { likes: userObjectId } },
            { new: true, session }
          );
        } else {
          // Like was removed, use the result from pull operation
          result = comment;
        }
      });

      return result;
    } catch (error: any) {
      throw new DatabaseError(`Error toggling like: ${error.message}`);
    } finally {
      // End the session
      await session.endSession();
    }
  }

  async createComment(data: CreateCommentRequest): Promise<CommentDocument> {
    return this.create({
      featureId: new Types.ObjectId(data.featureId),
      userId: new Types.ObjectId(data.userId),
      parentCommentId: data.parentCommentId ? new Types.ObjectId(data.parentCommentId) : undefined,
      content: data.content,
      isApprovedSolution: false,
      likes: []
    });
  }

  override async update(id: string, data: UpdateCommentRequest): Promise<CommentDocument> {
    return super.update(id, data as UpdateQuery<CommentDocument>);
  }
} 