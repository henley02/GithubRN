import React, { createRef } from 'react';
import { Linking, View } from 'react-native';
import NavigationUtil from '../../public/js/NavigationUtil';
import ViewUtil from '../../public/js/ViewUtil';
import actions from '../../redux/actions';
import { connect } from 'react-redux';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-easy-toast';
import AboutCommon, { FLAG_ABOUT } from '../../components/AboutCommon/AboutCommon';
import config from '../../config/config.json';
import Underline from '../../components/Underline/Underline';
import SettingItem from '../../components/SettingItem/SettingItem';
import Ionicons from 'react-native-vector-icons/Ionicons';

class AboutMePage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon(
            {
                ...this.params,
                theme: this.props.theme,
                navigation: this.props.navigation,
                flagAbout: FLAG_ABOUT.flag_about_me,
            },
            (data) => this.setState({ ...data })
        );
        this.state = {
            data: config,
            showTutorial: true,
            showBlog: false,
            showQQ: false,
            showContact: false,
        };
        this.toastRef = createRef();
    }

    onClick = (tab) => {
        if (!tab) {
            return;
        }
        if (tab.url) {
            NavigationUtil.goPage('WebviewPage', {
                title: tab.title,
                url: tab.url,
            });
        }
        if (tab.account && tab.account.indexOf('@') > -1) {
            const url = `mailto:${tab.account}`;
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
            return;
        }
        if (tab.account) {
            Clipboard.setString(tab.account);
            this.toastRef.current.show(`${tab.title} ${tab.account}已复制到剪切板。`);
        }
    };

    getItem = (menu) => {
        const { theme } = this.props;
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
    };

    _item(data, isShow, key) {
        const { theme } = this.props;
        return (
            <SettingItem
                callback={() =>
                    this.setState({
                        [key]: !this.state[key],
                    })
                }
                text={data.name}
                color={theme.themeColor}
                Icons={Ionicons}
                icon={data.icon}
                expandableIco={isShow ? 'chevron-up' : 'chevron-down'}
            />
        );
    }

    renderItems(dic, isShowAccount) {
        if (!dic) {
            return null;
        }
        const { theme } = this.props;
        let views = [];
        for (let i in dic) {
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    <SettingItem callback={() => this.onClick(dic[i])} text={title} color={theme.themeColor} />
                    <Underline />
                </View>
            );
        }
        return views;
    }

    render() {
        const content = (
            <View>
                {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
                <Underline />
                {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

                {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
                <Underline />
                {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

                {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
                <Underline />
                {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

                {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
                <Underline />
                {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}
                <Toast ref={this.toastRef} position={'center'} />
            </View>
        );
        return this.aboutCommon.render(content, this.state.data.author);
    }
}

const mapStateToProps = (state) => ({
    theme: state.theme.theme,
});

const mapDispatchToProps = (dispatch) => ({
    onChangeTheme: (theme) => dispatch(actions.onChangeTheme(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutMePage);
