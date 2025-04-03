module.exports = (sequelize, DataTypes) => {
	const Message = sequelize.define("Message", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		encrypted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	});

	Message.associate = (models) => {
		Message.belongsTo(models.User, {
			foreignKey: "userId",
			as: "user",
		});
		Message.belongsTo(models.Room, {
			foreignKey: "roomId",
			as: "room",
		});
	};

	return Message;
};
