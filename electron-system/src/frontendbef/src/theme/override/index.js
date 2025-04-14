import Input from "./Input";
import Autocomplete from "./Autocomplete";
import Button from "./Button";
import Table from "./Table";
import Dialog from "./Dialog";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
	return Object.assign(Input(theme), Autocomplete(theme), Button(theme), Table(theme), Dialog(theme));
}
