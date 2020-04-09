import { queryNews, delNews, updateNews, addNews, getNewsDetail } from '@/services/api';

export default {
  namespace: 'news',

  reducers: {
    saveNewsList(state, { payload }) {
      return {
        ...state,
        newsList: payload,
      };
    },
    saveNewsListTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    saveNewsDetail(state, { payload }) {
      return {
        ...state,
        newsDetail: payload,
      };
    },
  },

  state: {
    newsList: [],
    total: 0,
    newsDetail: {
      _id: '',
      author: '',
      // category: [],
      comments: [],
      create_time: '',
      desc: '',
      id: 16,
      img_url: '',
      keyword: [],
      like_users: [],
      meta: { views: 0, likes: 0, comments: 0 },
      origin: 0,
      state: 1,
      newsTag: [],
      title: '',
      update_time: '',
    },
  },

  effects: {
    *queryNews({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryNews, params);
      !!resolve && resolve(response); // 返回数据
      // console.log('response :', response)
      if (response.code === 0) {
        yield put({
          type: 'saveNewsList',
          payload: response.data.list,
        });
        yield put({
          type: 'saveNewsListTotal',
          payload: response.data.count,
        });
      }
    },
    *delNews({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(delNews, params);
      !!resolve && resolve(response);
    },
    *addNews({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(addNews, params);
      !!resolve && resolve(response);
    },
    *updateNews({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(updateNews, params);
      !!resolve && resolve(response);
    },
    *getNewsDetail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(getNewsDetail, params);
      !!resolve && resolve(response);
      // console.log('response :', response)
      if (response.code === 0) {
        yield put({
          type: 'saveNewsDetail',
          payload: response.data,
        });
      }
    },
  },
};
