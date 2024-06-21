import ChatService from "./chat.service";
import { Request, Response } from "express";

class chatController {
	private chatService: ChatService;

	constructor(chatService: ChatService) {
		this.chatService = chatService;
	}

	async handleWebSocketConnection(
		ws: WebSocket,
		chatId: string,
		userPrompt: string
	) {
		try {
			await this.chatService.create(userPrompt, chatId, (data) => {
				ws.send(JSON.stringify(data));
			});
		} catch (error) {
			ws.send(
				JSON.stringify({ error: "Failed to process Cohere stream" })
			);
		}
	}

	createChat = async (req: Request, res: Response) => {
		try {
			const chat = await this.chatService.createChat();
			res.status(200).send(chat);
		} catch (error) {
			res.status(500).send({ error: "Failed to create chat" });
		}
	};

	// pushMessage = async (req: Request, res: Response) => {
	// 	const { chatId, message, role } = req.body;
	// 	try {
	// 		await this.chatService.pushMessage(chatId, message, role);
	// 		res.status(200).send({ message: "Message pushed successfully" });
	// 	} catch (error) {
	// 		res.status(500).send({ error: "Failed to push message" });
	// 	}
	// };

	getChats = async (req: Request, res: Response) => {
		try {
			const chats = await this.chatService.getChats();
			res.status(200).send(chats);
		} catch (error) {
			res.status(500).send({ error: "Failed to get chats" });
		}
	};

	getChatById = async (req: Request, res: Response) => {
		const { chatId } = req.params;
		try {
			const chat = await this.chatService.getChatById(chatId);
			res.status(200).send(chat);
		} catch (error) {
			res.status(500).send({ error: "Failed to get chat" });
		}
	};
}

export default chatController;
