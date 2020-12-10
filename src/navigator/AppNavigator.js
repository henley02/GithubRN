import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomePage from '../pages/WelcomePage/WelcomePage';
import HomePage from '../pages/HomePage/HomePage';
import DetailPage from '../pages/DetailPage/DetailPage';
import FetchDemoPage from '../pages/FetchDemoPage/FetchDemoPage';
import WebviewPage from '../pages/WebviewPage/WebviewPage';
import AboutPage from '../pages/AboutPage/AboutPage';
import AboutMePage from '../pages/AboutMePage/AboutMePage';
import CustomKeyPage from '../pages/CustomKeyPage/CustomKeyPage';
import SortKeyPage from '../pages/SortKeyPage/SortKeyPage';
import SearchPage from '../pages/SearchPage/SearchPage';

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            headerShown: false,
        },
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            headerShown: false,
        },
    },
    FetchDemoPage: FetchDemoPage,
    WebviewPage: {
        screen: WebviewPage,
        navigationOptions: {
            headerShown: false,
        },
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            headerShown: false,
        },
    },
    AboutMePage: {
        screen: AboutMePage,
        navigationOptions: {
            headerShown: false,
        },
    },
    CustomKeyPage: {
        screen: CustomKeyPage,
        navigationOptions: {
            headerShown: false,
        },
    },
    SortKeyPage: {
        screen: SortKeyPage,
        navigationOptions: {
            headerShown: false,
        },
    },
    SearchPage: {
        screen: SearchPage,
        navigationOptions: {
            headerShown: false,
        },
    },
});

export default createAppContainer(
    createSwitchNavigator(
        {
            Init: WelcomePage,
            Main: MainNavigator,
        },
        {
            navigationOptions: {
                // headerShown: false,
            },
        }
    )
);
