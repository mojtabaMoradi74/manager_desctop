// src/backend/models/user.model.js
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
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.ENUM("admin", "user"),
				defaultValue: "user",
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{
			timestamps: true,
			paranoid: true,
			indexes: [
				{
					fields: ["email"],
				},
				{
					fields: ["username"],
				},
			],
		}
	);

	// User.associate = function (models) {
	// 	User.hasMany(models.Session, {
	// 		foreignKey: "userId",
	// 		as: "sessions",
	// 	});
	// };

	return User;
};
