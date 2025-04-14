// import cLog from "utils/cLog";

export default function RemoveNullObjectValue(params) {
    // console.log({ params });
    return Object.entries(params).reduce(
        (prev, [key, value]) => (value ? { ...prev, [key]: value } : prev),
        {}
    );
}