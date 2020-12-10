import { getData } from '../storage';
import fetchData from '../../fetch';

export default class DataStorage {
    fetchData = async (url, flag) => {
        try {
            const localData = await getData(url);
            if (localData && this.checkTimestampValid(localData.timestamp)) {
                return localData;
            } else {
                const res = await fetchData(url, flag);
                return res;
            }
        } catch (e) {
            const res = await fetchData(url, flag);
            return res;
        }
    };

    checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetData = new Date();
        targetData.setTime(timestamp);
        if (currentDate.getMonth() !== targetData.getMonth()) {
            return false;
        }
        if (currentDate.getDate() !== targetData.getDate()) {
            return false;
        }
        if (currentDate.getHours() - targetData.getHours() > 4) {
            return false;
        }
        return true;
    }
}
