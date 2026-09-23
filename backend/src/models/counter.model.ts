import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
  tenantId: mongoose.Types.ObjectId | string;
  sequenceName: string;
  value: number;
}

const counterSchema = new Schema<ICounter>({
  tenantId: { type: Schema.Types.Mixed, required: true },
  sequenceName: { type: String, required: true },
  value: { type: Number, default: 0 },
});

counterSchema.index({ tenantId: 1, sequenceName: 1 }, { unique: true });

counterSchema.statics.getNextValue = async function (tenantId: string | mongoose.Types.ObjectId, sequenceName: string): Promise<number> {
  const result = await this.findOneAndUpdate(
    { tenantId, sequenceName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return result.value;
};

export const Counter = mongoose.model<ICounter, mongoose.Model<ICounter> & { getNextValue: (tenantId: string | mongoose.Types.ObjectId, sequenceName: string) => Promise<number> }>('Counter', counterSchema);
