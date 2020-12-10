export default class NavigationUtil {
    /**
     * 跳转指定的页面
     * @param params
     * @param page
     */
    static goPage(page, params) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
        }
        navigation.navigate(page, { ...params });
    }

    /**
     * 重置到首页
     * @param params
     */
    static resetToHomePage(params) {
        const { navigation } = params;
        navigation.navigate('Main');
    }

    static goBack(params) {
        const { navigation } = params;
        navigation.goBack();
    }
}
