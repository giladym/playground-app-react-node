import { BaseEntity } from './entity.interface';
import { Types } from 'mongoose';

export interface Comment extends BaseEntity {
  featureId: Types.ObjectId;
  userId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  content: string;
  isApprovedSolution: boolean;
  likes: Types.ObjectId[];
}

export interface CreateCommentRequest {
  featureId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
}

export interface UpdateCommentRequest {
  content?: string;
  isApprovedSolution?: boolean;
}

export interface CommentResponse extends Omit<Comment, 'featureId' | 'userId' | 'parentCommentId' | 'likes'> {
  featureId: string;
  userId: string;
  parentCommentId?: string;
  likes: string[];
  likeCount: number;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
} 