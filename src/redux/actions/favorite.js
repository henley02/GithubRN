import { FAVORITE_LOAD_DATA, FAVORITE_LOAD_FAIL, FAVORITE_LOAD_SUCCESS } from './action-types';
import FavoriteDao from '../../public/js/expand/FavoriteDao';

export function onLoadFavoriteData(flag, isShowLoading) {
    return (dispatch) => {
        if (isShowLoading) {
            dispatch({ type: FAVORITE_LOAD_DATA, storeName: flag });
        }
        new FavoriteDao(flag)
            .getAllItems()
            .then((items) => {
                let resultData = [];
                for (let i = 0; i < items.length; i++) {
                    resultData.push({ ...items[i], isFavorite: true });
                }
                dispatch({
                    type: FAVORITE_LOAD_SUCCESS,
                    projectModels: resultData,
                    storeName: flag,
                });
            })
            .catch((e) => {
                dispatch({
                    type: FAVORITE_LOAD_FAIL,
                    storeName: flag,
                    error: e,
                });
            });
    };
}
