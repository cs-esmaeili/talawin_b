exports.checkDelayTime = (minTime, delayTime, betweenTimes = true) => {
    try {
        let currentTime = new Date().toISOString();
        let maxTime = new Date(minTime);
        maxTime.setMinutes(parseInt(maxTime.getMinutes()) + parseInt(delayTime));
        maxTime = maxTime.toISOString();

        if (betweenTimes == false && (currentTime > maxTime)) {
            return true;
        }
        if (betweenTimes && currentTime >= new Date(minTime).toISOString() && currentTime <= maxTime) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}