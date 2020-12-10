import React from 'react';
import { Linking, View } from 'react-native';
import { MORE_MENU } from '../../config/More_menu';
import NavigationUtil from '../../public/js/NavigationUtil';
import ViewUtil from '../../public/js/ViewUtil';
import actions from '../../redux/actions';
import { connect } from 'react-redux';
import AboutCommon, { FLAG_ABOUT } from '../../components/AboutCommon/AboutCommon';
import config from '../../config/config.json';
import Underline from '../../components/Underline/Underline';

class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon(
            {
                ...this.params,
                navigation: this.props.navigation,
                theme: this.props.theme,
                flagAbout: FLAG_ABOUT.flag_about_me,
            },
            (data) => this.setState({ ...data })
        );
        this.state = {
            data: config,
        };
    }

    onClick = (menu) => {
        let RouteName,
            url = '',
            params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebviewPage';
                params = {
                    title: '教程',
                    url: 'https://coding.m.imooc.com/classindex.html?cid=89',
                };
                break;
            case MORE_MENU.Feedback:
                url = 'mailto:410451447@qq.com';
                Linking.canOpenURL(url)
                    .then((support) => {
                        if (!support) {
                            console.log(support);
                        } else {
                            Linking.openURL(url);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage';
                break;
        }
        if (RouteName) {
            NavigationUtil.goPage(RouteName, params);
        }
    };

    getItem = (menu) => {
        const { theme } = this.props;
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
    };

    render() {
        const content = (
            <View>
                {this.getItem(MORE_MENU.Tutorial)}
                <Underline />
                {this.getItem(MORE_MENU.About_Author)}
                <Underline />
                {this.getItem(MORE_MENU.Feedback)}
            </View>
        );
        return this.aboutCommon.render(content, this.state.data.app);
    }
}

const mapStateToProps = (state) => ({
    theme: state.theme.theme,
});
const mapDispatchToProps = (dispatch) => ({
    onChangeTheme: (theme) => dispatch(actions.onChangeTheme(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage);
