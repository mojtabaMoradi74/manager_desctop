import HousesPopup from "src/components/Popup/HousesPopup";
import EditEmailPopup from "src/components/Popup/EditEmailPopup";
import EditNamePopup from "src/components/Popup/EditNamePopup";
import EditNationalCodePopup from "src/components/Popup/EditNationalCodePopup";
import WalletPopup from "src/components/WalletPopup/index";

const PopupMiddleware = () => {
	return (
		<>
			<WalletPopup />
			<EditNamePopup />
			<EditEmailPopup />
			<EditNationalCodePopup />
			<HousesPopup />
		</>
	);
};

export default PopupMiddleware;
