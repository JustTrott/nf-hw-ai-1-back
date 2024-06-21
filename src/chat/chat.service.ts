import cohere from "../cohereai";
import ChatModel from "./models/Chat";

class ChatService {
	private currentMessage: string = "";

	async create(
		userPrompt: string,
		chatId: string,
		callback: (data: any) => void
	) {
		const stream = await cohere.chatStream({
			model: "command",
			message: userPrompt,
			conversationId: chatId,
		});
		try {
			for await (const chat of stream) {
				if (chat.eventType === "text-generation") {
					this.currentMessage += chat.text;
					callback({ chunk: chat.text, end: false });
				} else if (chat.eventType === "stream-end") {
					callback({ end: true });
					await this.pushMessage(chatId, userPrompt, "user");
					await this.pushMessage(chatId, this.currentMessage, "bot");
					this.currentMessage = "";
				}
			}
		} catch (error) {
			console.error("Error processing Cohere stream", error);
			throw new Error("Failed to process Cohere stream");
		}
	}

	async createChat() {
		const chat = new ChatModel();
		await chat.save();
		return chat;
	}

	async pushMessage(chatId: string, message: string, role: string) {
		const chat = await ChatModel.findById(chatId);
		if (!chat) {
			console.log(`Error: Chat ${chatId} not found`);
			return;
		}
		chat.messages.push({
			role,
			message,
		});
		await chat.save();
	}

	async getChats() {
		return await ChatModel.find();
	}

	async getChatById(chatId: string) {
		return await ChatModel.findById(chatId);
	}
}

export default ChatService;
