export default class ErrorHandle extends Error {
    constructor(message, ...props) {
        super(message);
        this.type = props?.type;
        this.isRecoverable = isRecoverable;
        this.name = "InstallationError";
        this.info = props
    }
}