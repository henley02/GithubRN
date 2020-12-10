import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackPressComponent from '../../components/BackPressComponent/BackPressComponent';
import actions from './../../redux/actions/index';
import { connect } from 'react-redux';
import LanguageDao, { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import ViewUtil from '../../public/js/ViewUtil';
import GlobalStyles from '../../public/js/GlobalStyles';
import Underline from '../../components/Underline/Underline';
import BackButton from '../../components/BackButton/BackButton';
import ArrayUtil from '../../public/js/ArrayUtil';

class CustomKeyPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.changeValues = [];
        this.isRemoveKey = this.params.isRemoveKey;
        this.backPress = new BackPressComponent({
            backPress: (e) => this.onBackPress(e),
        });
        this.LanguageDao = new LanguageDao(this.params.flag);
        this.state = {
            keys: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState),
            };
        }
        return null;
    }

    /**
     * 获取标签
     * @param props
     * @param original 移除标签时使用，是否从props获取原始对的标签
     * @param state 移除标签时使用
     * @returns {*}
     * @private
     */
    static _keys(props, original, state) {
        const { flag, isRemoveKey } = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
        if (isRemoveKey && !original) {
            return (
                // 如果state中的keys为空则从props中取
                (state && state.keys && state.keys.length !== 0 && state.keys) ||
                props.language[key].map((val) => {
                    return {
                        ...val,
                        checked: false,
                    };
                })
            );
        } else {
            return props.language[key];
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        if (CustomKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props),
        });
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？', [
                {
                    text: '否',
                    onPress: () => {
                        this.props.navigation.goBack();
                    },
                },
                {
                    text: '是',
                    onPress: () => {
                        this.onSave();
                    },
                },
            ]);
        } else {
            this.props.navigation.goBack();
        }
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigation.goBack();
        } else {
            let keys;
            if (this.isRemoveKey) {
                for (let i = 0; i < this.changeValues.length; i++) {
                    ArrayUtil.remove((keys = CustomKeyPage._keys(this.props, true)), this.changeValues[i], 'name');
                }
            }
            this.LanguageDao.save(keys || this.state.keys);
            const { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
            this.props.navigation.goBack();
        }
    }

    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) {
            return;
        }
        let views = [];
        for (let i = 0; i < dataArray.length; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < dataArray.length && this.renderCheckBox(dataArray[i + 1], i + 1)}
                    </View>
                    <Underline height={1} />
                </View>
            );
        }
        return views;
    }

    onClick(data, index) {
        data.checked = !data.checked;
        ArrayUtil.updateArray(this.changeValues, data);
        let { keys } = this.state;
        keys[index] = data;
        this.setState({
            keys: keys,
        });
    }

    _checkedImage(checked) {
        const { theme } = this.props;
        return <Ionicons name={checked ? 'ios-checkbox' : 'md-square-outline'} size={20} style={{ color: theme.themeColor }} />;
    }

    renderCheckBox(data, index) {
        return (
            <CheckBox
                style={{ flex: 1, padding: 10 }}
                leftText={data.name}
                isChecked={data.checked}
                onClick={() => this.onClick(data, index)}
                checkedImage={this._checkedImage(true)}
                uncheckedImage={this._checkedImage(false)}
            />
        );
    }

    render() {
        const { theme } = this.props;
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        let navigationBar = (
            <NavigationBar
                title={title}
                style={theme.style.navBar}
                leftButton={<BackButton goBack={() => this.onBack()} />}
                rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
            />
        );
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <ScrollView>{this.renderView()}</ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.language,
    theme: state.theme.theme,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomKeyPage);

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
    },
});
