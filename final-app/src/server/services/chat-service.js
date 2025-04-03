const { Message, Room, User } = require("../database/models");
const logger = require("../../shared/lib/logger");

class ChatService {
	constructor(io) {
		this.io = io;
	}

	async sendMessage(messageData) {
		try {
			const message = await Message.create({
				content: messageData.content,
				userId: messageData.userId,
				roomId: messageData.roomId,
				encrypted: messageData.encrypted || false,
			});

			const fullMessage = await Message.findByPk(message.id, {
				include: [
					{
						model: User,
						as: "user",
						attributes: ["id", "username"],
					},
					{
						model: Room,
						as: "room",
						attributes: ["id", "name"],
					},
				],
			});

			this.io.to(`room_${messageData.roomId}`).emit("new_message", fullMessage);
			return fullMessage;
		} catch (error) {
			logger.error("Failed to send message", error);
			throw error;
		}
	}

	async getRoomMessages(roomId, limit = 50) {
		return Message.findAll({
			where: { roomId },
			limit,
			order: [["timestamp", "DESC"]],
			include: [
				{
					model: User,
					as: "user",
					attributes: ["id", "username"],
				},
			],
		});
	}
}

module.exports = ChatService;
