import { Router } from "express";
import { Server, WebSocket } from "ws";
import ChatService from "./chat.service";
import ChatController from "./chat.controller";

const chatRouter = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);

const wss = new Server({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
	ws.on("message", async (data: string) => {
		const { chatId, message } = JSON.parse(data.toString());
		const userPrompt = message.toString();
		await chatController.handleWebSocketConnection(ws, chatId, userPrompt);
	});

	ws.send(JSON.stringify({ debugMessage: "Connected to WebSocket server" }));
});

chatRouter.get("/chats", chatController.getChats);
chatRouter.get("/chats/:chatId", chatController.getChatById);
chatRouter.post("/chats", chatController.createChat);

export { chatRouter, wss };
