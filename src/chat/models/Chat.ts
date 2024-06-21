import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
	messages: {
		role: string;
		message: string;
	}[];
	conversationId: string;
}

const ChatSchema: Schema = new Schema({
	messages: {
		type: [
			{
				role: {
					type: String,
					required: true,
				},
				message: {
					type: String,
					required: true,
				},
			},
		],
		required: true,
		default: [],
	},
});

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
