import Trending from 'GitHubTrending';

const AUTH_TOKEN = 'fd82d1e882462e23b8e88aa82198f166';
export const FLAG_STORAGE = {
    flag_popular: 'popular',
    flag_trending: 'flag_trending',
};

export default function fetchData(url, flag) {
    return new Promise((resolve, reject) => {
        if (flag !== FLAG_STORAGE.flag_trending) {
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network  response was not ok.');
                })
                .then(async (res) => {
                    // await saveData(url, res);
                    resolve(res);
                })
                .catch((error) => reject(error));
        } else {
            new Trending(AUTH_TOKEN)
                .fetchTrending(url)
                .then((items) => {
                    if (!items) {
                        throw new Error('responseData is null');
                    }
                    resolve(items);
                })
                .catch((error) => reject(error));
        }
    });
}
