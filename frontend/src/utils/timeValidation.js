export const isEndTimeAfterStartTime = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return true;
    }

    return endTime > startTime;
};
