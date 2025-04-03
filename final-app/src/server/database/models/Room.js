module.exports = (sequelize, DataTypes) => {
	const Room = sequelize.define("Room", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isPrivate: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		description: {
			type: DataTypes.TEXT,
		},
	});

	Room.associate = (models) => {
		Room.hasMany(models.Message, {
			foreignKey: "roomId",
			as: "messages",
		});
		Room.belongsToMany(models.User, {
			through: "RoomUsers",
			as: "members",
		});
	};

	return Room;
};
