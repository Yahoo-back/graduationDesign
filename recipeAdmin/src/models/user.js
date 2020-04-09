import { query as queryAdmin, queryCurrent } from '@/services/user';
import { updateUser, getUserDetail } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {
      _id: '',
      email: '',
      name: '',
      password: '',
      phone: '',
      introduce: '',
    },
    userDetail: {
      _id: '',
      email: '',
      name: '',
      password: '',
      phone: '',
      introduce: '',
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryAdmin);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      console.log(response);
      if (response.code == 1) {
        message.error(response.message);
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
    *delUser({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(delUser, params);
      !!resolve && resolve(response);
    },
    // 个人信息设置
    // *updateUser({ payload }, { call, put }) {
    //   const { resolve, params } = payload;
    //   const response = yield call(updateUser, params);
    //   !!resolve && resolve(response);
    // },

    *getUserDetail({ payload }, { call, put }) {
      // const loading = message.loading('保存中...', 0);
      const response = yield call(updateUser, payload);
      console.log(response);
      if (response.code == 0) {
        yield put({
          type: 'saveUserDetail',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
      // setTimeout(loading, 0);
    },

    *updateUser({ payload }, { call, put }) {
      // const loading = message.loading('保存中...', 0);
      const data = yield call(updateUser, payload);
      if (data.code == 0) {
        yield put({
          type: 'fetchCurrent',
          payload: payload._id,
        });
        message.success('个人信息已修改！');
      } else {
        message.error(data.message);
      }
      // setTimeout(loading, 0);
    },
  },

  reducers: {
    saveUserDetail(state, { payload }) {
      return {
        ...state,
        userDetail: payload,
      };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
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
  },

  subscriptions: {
    // 获取数据的方法
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/account/settings') {
          dispatch({
            type: 'getUserDetail',
            // payload: {},
          });
        }
      });
    },
  },
};
