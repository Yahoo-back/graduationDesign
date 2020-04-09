import { queryNewsTag, addNewsTag, delNewsTag } from '@/services/api';

export default {
  namespace: 'newsTag',

  state: {
    newsTagList: [],
    total: 0,
  },

  effects: {
    *queryNewsTag({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryNewsTag, params);
      !!resolve && resolve(response); // 返回数据
      // console.log('response :', response)
      if (response.code === 0) {
        yield put({
          type: 'saveNewsTagList',
          payload: response.data.list,
        });
        yield put({
          type: 'saveNewsTagListTotal',
          payload: response.data.count,
        });
      } else {
        //
      }
    },
    *addNewsTag({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(addNewsTag, params);
      !!resolve && resolve(response);
    },
    *delNewsTag({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(delNewsTag, params);
      !!resolve && resolve(response);
    },
  },

  reducers: {
    saveNewsTagList(state, { payload }) {
      return {
        ...state,
        newsTagList: payload,
      };
    },
    saveNewsTagListTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
  },
};
