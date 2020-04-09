import { queryUser, addUser, updateUser, delUser } from '@/services/api';
import { queryCurrent } from '@/services/user';

export default {
  namespace: 'otherUser',

  state: {
    userList: [],
    total: 0,
    currentUser: {
      _id: '',
      email: '',
      name: '',
      password: '',
      phone: '',
      introduce: '',
    },
  },

  effects: {
    *queryUser({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryUser, params);
      !!resolve && resolve(response); // 返回数据
      // console.log('response :', response)
      if (response.code === 0) {
        yield put({
          type: 'saveUserList',
          payload: response.data.list,
        });
        yield put({
          type: 'saveUserListTotal',
          payload: response.data.count,
        });
      } else {
        //
      }
    },
    *addUser({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(addUser, params);
      !!resolve && resolve(response);
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code == 1) {
        message.error(response.message);
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
    // *updateUser({ payload }, { call, put }) {
    // 	const { resolve, params } = payload;
    // 	const response = yield call(updateUser, params);
    // 	!!resolve && resolve(response);
    // },
    *updateUser({ payload }, { call, put }) {
      // const loading = message.loading('保存中...', 0);
      const data = yield call(updateUser, payload);
      if (data.code === 0) {
        yield put({
          type: 'fetchCurrent',
          payload: data.data.list,
        });
        message.success('个人信息已修改！');
      } else {
        message.error(data.message);
      }
      // setTimeout(loading, 0);
    },
    *delUser({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(delUser, params);
      !!resolve && resolve(response);
    },
  },

  reducers: {
    saveUserList(state, { payload }) {
      return {
        ...state,
        userList: payload,
      };
    },
    saveUserListTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
