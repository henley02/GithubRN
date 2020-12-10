import { onChangeTheme, onThemeInit, onShowCustomThemeView } from './theme';
import { onFlushPopularFavorite, onLoadMorePopular, onLoadPopularData } from './popular';
import { onFlushTrendingFavorite, onLoadMoreTrending, onRefreshTrending } from './trending';
import { onLoadFavoriteData } from './favorite';
import { onLoadLanguage } from './language';
import { onSearch, onLoadMoreSearch, onSearchCancel } from './search';

export default {
    onChangeTheme,
    onThemeInit,
    onShowCustomThemeView,
    onLoadPopularData,
    onLoadMorePopular,
    onFlushPopularFavorite,
    onLoadMoreTrending,
    onRefreshTrending,
    onFlushTrendingFavorite,
    onLoadFavoriteData,
    onLoadLanguage,
    onSearch,
    onLoadMoreSearch,
    onSearchCancel,
};
