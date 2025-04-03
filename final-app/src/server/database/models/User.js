module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			passwordHash: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			publicKey: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			lastSeen: {
				type: DataTypes.DATE,
			},
			isOnline: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			indexes: [
				{
					unique: true,
					fields: ["username"],
				},
			],
		}
	);

	User.associate = (models) => {
		User.hasMany(models.Message, {
			foreignKey: "userId",
			as: "messages",
		});
		User.belongsToMany(models.Room, {
			through: "RoomUsers",
			as: "rooms",
		});
	};

	return User;
};
