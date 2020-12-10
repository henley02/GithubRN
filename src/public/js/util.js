export default class Util {
    static checkFavorite(item, items = []) {
        if (!items) {
            return false;
        }
        let id = item.fullName ? item.fullName : item.id;
        for (let i = 0; i < items.length; i++) {
            if (id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查key是否存在于keys中
     * @param keys
     * @param key
     * @returns {boolean}
     */
    static checkKeyIsExist(keys, key) {
        for (let i = 0; i < keys.length; i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}
