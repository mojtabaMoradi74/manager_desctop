import { routes } from "../../routes/paths";
import api from "../../services/api";

const ERoles = {
	title: {
		name: ["role", "roles"],
	},
	routes: routes.role,
	api: api.role,
};

export default ERoles;
