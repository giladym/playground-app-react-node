import { Schema, model, Document, Types } from 'mongoose';

export interface CommentDocument extends Document {
  featureId: Types.ObjectId;
  userId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  content: string;
  isApprovedSolution: boolean;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    featureId: {
      type: Schema.Types.ObjectId,
      ref: 'Feature',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isApprovedSolution: {
      type: Boolean,
      default: false,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
commentSchema.index({ featureId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });
commentSchema.index({ userId: 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function(this: CommentDocument) {
  return this.likes.length;
});

export const CommentModel = model<CommentDocument>('Comment', commentSchema); 