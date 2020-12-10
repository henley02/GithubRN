import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BaseItem from '../BaseItem/BaseItem';

export default class PopularItem extends BaseItem {
    render() {
        const { projectModel } = this.props;
        const item = projectModel;
        if (!projectModel || !projectModel.owner) {
            return null;
        } else {
            return (
                <TouchableOpacity onPress={() => this.onItemClick()} activeOpacity={1}>
                    <View style={styles.cell_container}>
                        <Text style={styles.title}>{item.full_name}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <View style={styles.row}>
                            <View style={styles.row}>
                                <Text>Auth:</Text>
                                <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar_url} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Start:</Text>
                                <Text>{item.stargazers_count}</Text>
                            </View>
                            {this._favoriteIcon()}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    user_container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar_url: {
        height: 30,
        width: 30,
        borderRadius: 50,
        marginLeft: 5,
    },
});
