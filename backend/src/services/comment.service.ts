import { BaseService } from './base.service';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../interfaces/comment.interface';
import { CommentRepository } from '../repositories/comment.repository';
import { NotFoundError } from '../utils/errors';
import { CommentDocument } from '../models/comment.model';
import { Mapper } from '../utils/mapper.util';

export class CommentService extends BaseService<Comment, CommentDocument> {
  constructor(private readonly commentRepository: CommentRepository) {
    super(commentRepository);
  }

  async findByFeature(featureId: string): Promise<Comment[]> {
    const docs = await this.commentRepository.findByFeature(featureId);
    return docs.map(doc => Mapper.toEntity<Comment>(doc));
  }

  async findByUser(userId: string): Promise<Comment[]> {
    const docs = await this.commentRepository.findByUser(userId);
    return docs.map(doc => Mapper.toEntity<Comment>(doc));
  }

  async toggleSolution(commentId: string): Promise<Comment> {
    const doc = await this.commentRepository.toggleSolution(commentId);
    if (!doc) {
      throw new NotFoundError(`Comment with id ${commentId} not found`);
    }
    return Mapper.toEntity<Comment>(doc);
  }

  async toggleLike(commentId: string, userId: string): Promise<Comment> {
    const doc = await this.commentRepository.toggleLike(commentId, userId);
    if (!doc) {
      throw new NotFoundError(`Comment with id ${commentId} not found`);
    }
    return Mapper.toEntity<Comment>(doc);
  }

  override async create(data: CreateCommentRequest): Promise<Comment> {
    const doc = await this.commentRepository.createComment(data);
    return Mapper.toEntity<Comment>(doc);
  }

  override async update(id: string, data: UpdateCommentRequest): Promise<Comment> {
    const doc = await this.commentRepository.update(id, data);
    if (!doc) {
      throw new NotFoundError(`Comment with id ${id} not found`);
    }
    return Mapper.toEntity<Comment>(doc);
  }
} 