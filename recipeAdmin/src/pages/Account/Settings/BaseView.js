import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button, notification } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';

// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    {
      // <div className={styles.avatar_title}>Avatar</div>
      // <div className={styles.avatar}>
      //   <img src={avatar} alt="avatar" />
      // </div>
      // <Upload fileList={[]}>
      //   <div className={styles.button_view}>
      //     <Button icon="upload">
      //       <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Change avatar" />
      //     </Button>
      //   </div>
      // </Upload>
    }
  </Fragment>
);

@connect(({ user, otherUser }) => ({
  currentUser: user.currentUser,
  queryUser: otherUser.queryUser,
}))
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      email: '',
      password: '',
      name: '',
      phone: '',
      introduce: '',
    };
    // this.handleChangeEmail = this.handleChangeEmail.bind(this);
    // this.handleChangePassword = this.handleChangePassword.bind(this);
    // this.handleChangeName = this.handleChangeName.bind(this);
    // this.handleChangePhone = this.handleChangePhone.bind(this);
    // this.handleNewsChangeIntroduce = this.handleNewsChangeIntroduce.bind(this);
  }

  handleChangeEmail = e => {
    this.setState({ email: e.target.value });
  };

  handleChangeName = e => {
    this.setState({
      name: e.target.value,
    });
  };

  handleChangePassword = e => {
    this.setState({
      password: e.target.value,
    });
  };

  handleChangePhone = e => {
    this.setState({
      phone: e.target.value,
    });
  };

  handleChangeIntroduce = e => {
    this.setState({
      introduce: e.target.value,
    });
  };

  // saveFn = () => {
  //   const { dispatch } = this.props;
  //   const { currentUser } = this.props;
  //   console.log(currentUser._id);
  //   const params = {
  //     _id: currentUser._id,
  //     email: this.state.email,
  //     password: this.state.password,
  //     name: this.state.name,
  //     phone: this.state.phone,
  //     introduce: this.state.introduce,
  //   };
  //   new Promise(resolve => {
  //     dispatch({
  //       type: 'otherUser/updateUser',
  //       payload: {
  //         resolve,
  //         params,
  //       },
  //     });
  //   }).then(res => {
  //     if (res.code === 0) {
  //       notification.success({
  //         message: res.message,
  //       });
  //       this.setState({
  //         email: '',
  //         password: '',
  //         name: '',
  //         phone: '',
  //         introduce: '',
  //       });
  //     } else {
  //       notification.error({
  //         message: res.message,
  //       });
  //     }
  //   });
  // };

  saveFn = () => {
    const { dispatch } = this.props;
    const { currentUser } = this.props;
    console.log(currentUser);
    const _id = currentUser._id;
    this.props.form.validateFields((err, values) => {
      new Promise(resolve => {
        dispatch({
          type: 'user/updateUser',
          payload: {
            _id,
            email: values.email,
            password: values.password,
            phone: values.useRange,
            name: values.name,
            introduce: values.introduce,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            name: '',
            password: '',
            phone: '',
            email: '',
            introduce: '',
          });
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
      // dispatch({
      //   type: 'user/updateUser',
      //   payload: {
      //     _id,
      //     email: values.email,
      //     password: values.password,
      //     phone: values.useRange,
      //     name: values.name,
      //     introduce: values.introduce,
      //   },
      // });
    });
  };

  handleChangeDesc(event) {
    this.setState({
      desc: event.target.value,
    });
  }

  handleChangeType(value) {
    console.log('type :', value);
    this.setState({
      type: value,
    });
  }

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { currentUser } = this.props;
    const email = currentUser.email;
    const name = currentUser.name;
    const password = currentUser.password;
    const phone = currentUser.phone;
    const introduce = currentUser.introduce;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                initialValue: email,
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input />)}
            </FormItem>
            {
              // <FormItem label={formatMessage({ id: 'app.settings.basic.password' })}>
              //   {getFieldDecorator('password', {
              //     initialValue: password,
              //   })(<Input />)}
              // </FormItem>
            }
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                initialValue: phone,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('introduce', {
                initialValue: introduce,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <Button type="primary" onClick={this.saveFn}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        {
          // <div className={styles.right}>
          //   <AvatarView avatar={this.getAvatarURL()} />
          // </div>
        }
      </div>
    );
  }
}

export default BaseView;

// import React, { Component, Fragment } from 'react';
// import { formatMessage, FormattedMessage } from 'umi/locale';
// import { Form, Input, Upload, Select, Button, notification } from 'antd';
// import { connect } from 'dva';
// import styles from './BaseView.less';

// // import { getTimeDistance } from '@/utils/utils';

// const FormItem = Form.Item;
// const { Option } = Select;

// // 头像组件 方便以后独立，增加裁剪之类的功能
// const AvatarView = ({ avatar }) => (
//   <Fragment>
//     {
//       // <div className={styles.avatar_title}>Avatar</div>
//       // <div className={styles.avatar}>
//       //   <img src={avatar} alt="avatar" />
//       // </div>
//       // <Upload fileList={[]}>
//       //   <div className={styles.button_view}>
//       //     <Button icon="upload">
//       //       <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Change avatar" />
//       //     </Button>
//       //   </div>
//       // </Upload>
//     }
//   </Fragment>
// );

// @connect(({ user, otherUser }) => ({
//   currentUser: user.currentUser,
//   queryUser: otherUser.queryUser
// }))
// @Form.create()
// class BaseView extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       _id: '',
//       email: '',
//       password: '',
//       name: '',
//       phone: '',
//       introduce: ''
//     };
//     // this.handleChangeEmail = this.handleChangeEmail.bind(this);
//     // this.handleChangePassword = this.handleChangePassword.bind(this);
//     // this.handleChangeName = this.handleChangeName.bind(this);
//     // this.handleChangePhone = this.handleChangePhone.bind(this);
//     // this.handleNewsChangeIntroduce = this.handleNewsChangeIntroduce.bind(this);
//   }

//   handleChangeEmail = e => {
//     this.setState({ email: e.target.value });
//   };

//   handleChangeName = e => {
//     this.setState({
//       name: e.target.value,
//     });
//   };

//   handleChangePassword = e => {
//     this.setState({
//       password: e.target.value,
//     });
//   };

//   handleChangePhone = e => {
//     this.setState({
//       phone: e.target.value,
//     });
//   };

//   handleChangeIntroduce = e => {
//     this.setState({
//       introduce: e.target.value,
//     });
//   };

//   saveFn = () => {
//     const { dispatch } = this.props;
//     const { currentUser } = this.props;
//       const params = {
//         _id: currentUser._id,
//         email: this.state.email,
//         password: this.state.password,
//         name: this.state.name,
//         phone: this.state.phone,
//         introduce: this.state.introduce,
//       };
//       new Promise(resolve => {
//         dispatch({
//           type: 'otherUser/updateUser',
//           payload: {
//             resolve,
//             params,
//           },
//         });
//       }).then(res => {
//         if (res.code === 0) {
//           notification.success({
//             message: res.message,
//           });
//           this.setState({
//            email: '',
//            password: '',
//            name: '',
//            phone: '',
//            introduce: ''
//           });
//         } else {
//           notification.error({
//             message: res.message,
//           });
//         }
//       });
//   }

//   // saveFn = () => {
//   //   const { dispatch } = this.props;
//   //   const { currentUser } = this.props;
//   //   const { vemail, vpassword, vname, vphone, vintroduce } = this.state;
//   //   console.log(currentUser);
//   //   const _id = currentUser._id;
//   //   dispatch({
//   //     type: 'otherUser/updateUser',
//   //     payload: {
//   //       _id,
//   //       email: vemail,
//   //       name: vname,
//   //       password: vpassword,
//   //       phone: vphone,
//   //       introduce: vintroduce,
//   //     },
//   //   });
//   //   dispatch({
//   //     type: 'otherUser/queryUser',
//   //   });
//   // };

//   handleChangeDesc(event) {
//     this.setState({
//       desc: event.target.value,
//     });
//   }

//   handleChangeType(value) {
//     console.log('type :', value);
//     this.setState({
//       type: value,
//     });
//   }

//   componentDidMount() {
//     this.setBaseInfo();
//   }

//   setBaseInfo = () => {
//     const { currentUser, form } = this.props;
//     Object.keys(form.getFieldsValue()).forEach(key => {
//       const obj = {};
//       obj[key] = currentUser[key] || null;
//       form.setFieldsValue(obj);
//     });
//   };

//   getAvatarURL() {
//     const { currentUser } = this.props;
//     if (currentUser.avatar) {
//       return currentUser.avatar;
//     }
//     const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
//     return url;
//   }

//   getViewDom = ref => {
//     this.view = ref;
//   };

//   render() {
//     const {
//       form: { getFieldDecorator },
//     } = this.props;
//     return (
//       <div className={styles.baseView} ref={this.getViewDom}>
//         <div className={styles.left}>
//           <Form layout="vertical" hideRequiredMark>
//             <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
//               {getFieldDecorator('email', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
//                   },
//                 ],
//               })(<Input onChange={e => this.handleChangeEmail(e)} />)}
//             </FormItem>
//             <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
//               {getFieldDecorator('name', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
//                   },
//                 ],
//               })(<Input onChange={e => this.handleChangeName(e)} />)}
//             </FormItem>
//             <FormItem label={formatMessage({ id: 'app.settings.basic.password' })}>
//               {getFieldDecorator('password', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage({ id: 'app.settings.basic.password-message' }, {}),
//                   },
//                 ],
//               })(<Input onChange={e => this.handleChangePassword(e)} />)}
//             </FormItem>
//             <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
//               {getFieldDecorator('phone', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
//                   },
//                 ],
//               })(<Input onChange={e => this.handleChangePhone(e)} />)}
//             </FormItem>
//             <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
//               {getFieldDecorator('introduce', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
//                   },
//                 ],
//               })(
//                 <Input.TextArea
//                   placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
//                   rows={4}
//                   onChange={e => this.handleChangeIntroduce(e)}
//                 />
//               )}
//             </FormItem>
//             <Button type="primary" onClick={this.saveFn}>
//               <FormattedMessage
//                 id="app.settings.basic.update"
//                 defaultMessage="Update Information"
//               />
//             </Button>
//           </Form>
//         </div>
//         {
//           // <div className={styles.right}>
//           //   <AvatarView avatar={this.getAvatarURL()} />
//           // </div>
//         }
//       </div>
//     );
//   }
// }

// export default BaseView;
