import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 保存
 */
export const saveData = (key, val) => {
    if (!key || !val) {
        return;
    }
    AsyncStorage.setItem(key, JSON.stringify({ data: val, val, timestamp: new Date().getTime() }));
};

/**
 * 获取
 */
export const getData = async (key) => {
    try {
        const result = await AsyncStorage.getItem(key);
        return result != null ? JSON.parse(result) : null;
    } catch (e) {}
};

/**
 * 删除
 */
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {}
};
