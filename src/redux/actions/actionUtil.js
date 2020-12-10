import Util from '../../public/js/util';

export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao, params) {
    let fixItems = [];
    if (data) {
        if (Array.isArray(data)) {
            fixItems = data;
        } else if (Array.isArray(data.items)) {
            fixItems = data.items;
        }
    }
    let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
    _projectModels(showItems, favoriteDao, (projectModels) => {
        dispatch({
            storeName,
            items: fixItems,
            projectModels: projectModels,
            type: actionType,
            pageSize,
            pageIndex: 1,
            ...params,
        });
    });
}

export async function _projectModels(showItems, favoriteDao, callback) {
    let keys = [];
    try {
        keys = await favoriteDao.getFavoriteKeys();
        let projectModels = [];
        for (let i = 0; i < showItems.length; i++) {
            const isFavorite = Util.checkFavorite(showItems[i], keys);
            projectModels.push({ ...showItems[i], isFavorite: isFavorite });
        }
        doCallBack(callback, projectModels);
    } catch (e) {
        console.log(e);
    }
}

export const doCallBack = (callback, object) => {
    if (typeof callback === 'function') {
        callback(object);
    }
};
