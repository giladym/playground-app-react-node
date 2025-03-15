import { BaseService } from './base.service';
import { CommentRepository } from '../repositories/comment.repository';
import { Comment, CommentResponse, CreateCommentRequest } from '../interfaces/comment.interface';
import { NotFoundError } from '../utils/errors';
import { CommentDocument } from '../models/comment.model';
import { Mapper } from '../utils/mapper.util';

export class CommentService extends BaseService<Comment> {
  constructor(private readonly commentRepository: CommentRepository) {
    super(commentRepository as any);
  }

  async findByFeature(featureId: string): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.findByFeature(featureId);
    return comments.map(comment => this.formatCommentResponse(Mapper.toEntity<Comment>(comment)));
  }

  async findByUser(userId: string): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.findByUser(userId);
    return comments.map(comment => this.formatCommentResponse(Mapper.toEntity<Comment>(comment)));
  }

  async toggleSolution(id: string): Promise<CommentResponse> {
    const comment = await this.findById(id);
    const updatedComment = await this.update(id, { isApprovedSolution: !comment.isApprovedSolution });
    return this.formatCommentResponse(updatedComment);
  }

  async toggleLike(id: string, userId: string): Promise<CommentResponse> {
    const comment = await this.commentRepository.toggleLike(id, userId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }
    return this.formatCommentResponse(Mapper.toEntity<Comment>(comment));
  }

  async createComment(data: CreateCommentRequest): Promise<CommentResponse> {
    const comment = await this.commentRepository.createComment(data);
    return this.formatCommentResponse(Mapper.toEntity<Comment>(comment));
  }

  private formatCommentResponse(comment: Comment): CommentResponse {
    return {
      id: comment.id,
      content: comment.content,
      isApprovedSolution: comment.isApprovedSolution,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      featureId: comment.featureId.toString(),
      userId: comment.userId.toString(),
      parentCommentId: comment.parentCommentId?.toString(),
      likes: comment.likes.map(id => id.toString()),
      likeCount: comment.likes.length
    };
  }
} 