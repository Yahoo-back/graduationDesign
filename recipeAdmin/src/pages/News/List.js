import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Table,
  notification,
  Popconfirm,
  Divider,
  Tag,
  Select,
  Avatar,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NewsComponent from './NewsComponent';

const FormItem = Form.Item;
const Search = Input.Search;

/* eslint react/no-multi-comp:0 */
@connect(({ news }) => ({
  news,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeType: false,
      title: '',
      author: '',
      keyword: '',
      content: '',
      desc: '',
      img_url: '',
      origin: 0, // 0 原创，1 转载，2 混合
      state: 1, // 文章发布状态 => 0 草稿，1 已发布
      type: 1, // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
      newsTag: '',
      // category: '',
      newsTagDefault: [],
      // categoryDefault: [],
      searchState: '', // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
      searchKeyword: '',
      visible: false,
      loading: false,
      pageNum: 1,
      pageSize: 10,
      columns: [
        {
          title: '标题',
          width: 140,
          dataIndex: 'title',
          fixed: 'left'
        },
        {
          title: '作者',
          width: 130,
          dataIndex: 'author',
        },
        {
          title: '关键字',
          width: 130,
          dataIndex: 'keyword',
          render: arr => (
            <span>
              {arr.map(item => (
                <span color="magenta" key={item}>
                  {item}
                </span>
              ))}
            </span>
          ),
        },
        {
          title: '封面图',
          dataIndex: 'img_url',
          width: 140,
          render: val => <Avatar shape="square" src={val} size={64} icon="user" />,
        },
        {
          title: '标签',
          dataIndex: 'newsTag',
          width: 120,
          render: arr => (
            <span>
              {arr.map(item => (
                <Tag color="cyan" key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </span>
          ),
        },
        // {
        //   title: '分类',
        //   width: 120,
        //   dataIndex: 'category',
        //   render: arr => (
        //     <span>
        //       {arr.map(item => (
        //         <Tag color="blue" key={item.id}>
        //           {item.name}
        //         </Tag>
        //       ))}
        //     </span>
        //   ),
        // },
        {
          title: '状态',
          dataIndex: 'state',
          width: 120,
          render: val => {
            // 文章发布状态 => 0 草稿，1 已发布
            if (val === 0) {
              return <Tag color="red">草稿</Tag>;
            }
            if (val === 1) {
              return <Tag color="green">已发布</Tag>;
            }
          },
        },
        {
          title: '观看/点赞/评论',
          dataIndex: 'meta',
          width: 150,
          render: val => (
            <div>
              {' '}
              <span>观看：{val.views}</span> <span>点赞：{val.likes}</span> {' '}
            </div>
          ),
        },
        {
          title: '原创状态',
          width: 120,
          dataIndex: 'origin',
          render: val => {
            // 文章转载状态 => 0 原创，1 转载，2 混合
            if (val === 0) {
              return <Tag color="green">原创</Tag>;
            }
            if (val === 1) {
              return <Tag color="red">转载</Tag>;
            }
            return <Tag>混合</Tag>;
          },
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          width: 150,
          sorter: true,
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title: '操作',
          width: 120,
          fixed: 'right',
          render: (text, record) => (
            <div>
              <Fragment>
                <a onClick={() => this.showModal(record)}>修改</a>
              </Fragment>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除该资讯吗?"
                onConfirm={() => this.handleDelete(text, record)}
              >
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </div>
          ),
        },
      ],
    };

    this.handleChangeSearchKeyword = this.handleChangeSearchKeyword.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeSearchState = this.handleChangeSearchState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeOrigin = this.handleChangeOrigin.bind(this);
    this.handleNewsTagChange = this.handleNewsTagChange.bind(this);
    this.handleChangeAuthor = this.handleChangeAuthor.bind(this);
    this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);
    this.handleChangeImgUrl = this.handleChangeImgUrl.bind(this);
    // this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  componentDidMount() {
    this.handleSearch(this.state.pageNum, this.state.pageSize);
  }

  handleSubmit() {
    const { dispatch } = this.props;
    const { newsDetail } = this.props.news;
    if (!this.state.title) {
      notification.error({
        message: '资讯标题不能为空',
      });
      return;
    }
    if (!this.state.keyword) {
      notification.error({
        message: '资讯关键字不能为空',
      });
      return;
    }
    if (!this.state.content) {
      notification.error({
        message: '资讯内容不能为空',
      });
      return;
    }
    if (keyword instanceof Array) {
      keyword = keyword.join(',');
    }
    this.setState({
      loading: true,
    });

    let keyword = this.state.keyword;
    if (keyword instanceof Array) {
      keyword = keyword.join(',');
    }
    if (this.state.changeType) {
      const params = {
        id: newsDetail._id,
        title: this.state.title,
        author: this.state.author,
        desc: this.state.desc,
        keyword,
        content: this.state.content,
        img_url: this.state.img_url,
        origin: this.state.origin,
        state: this.state.state,
        type: this.state.type,
        newsTag: this.state.newsTag,
        // category: this.state.category,
      };
      new Promise(resolve => {
        dispatch({
          type: 'news/updateNews',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            visible: false,
            changeType: false,
            title: '',
            author: '',
            keyword: '',
            content: '',
            desc: '',
            img_url: '',
            origin: 0, // 0 原创，1 转载，2 混合
            state: 1, // 文章发布状态 => 0 草稿，1 已发布
            type: 1, // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
            newsTag: '',
            // category: '',
            newsTagDefault: [],
            // categoryDefault: [],
          });
          this.handleSearch(this.state.pageNum, this.state.pageSize);
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      const params = {
        title: this.state.title,
        author: this.state.author,
        desc: this.state.desc,
        keyword: this.state.keyword,
        content: this.state.content,
        img_url: this.state.img_url,
        origin: this.state.origin,
        state: this.state.state,
        type: this.state.type,
        newsTag: this.state.newsTag,
        // category: this.state.category,
      };
      new Promise(resolve => {
        dispatch({
          type: 'news/addNews',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            visible: false,
            changeType: false,
          });
          this.handleSearch(this.state.pageNum, this.state.pageSize);
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  }

  handleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }

  handleChangeAuthor(event) {
    this.setState({
      author: event.target.value,
    });
  }

  handleChangeContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleChangeImgUrl(event) {
    this.setState({
      img_url: event.target.value,
    });
  }

  handleChangeKeyword(event) {
    this.setState({
      keyword: event.target.value,
    });
  }

  handleChangeOrigin(value) {
    this.setState({
      origin: value,
    });
  }

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

  handleNewsTagChange(value) {
    const newsTag = value.join();
    console.log('newsTag :', newsTag);
    this.setState({
      newsTagDefault: value,
      newsTag,
    });
  }

  // handleCategoryChange(value) {
  //   const category = value.join();
  //   console.log('category :', category);
  //   this.setState({
  //     categoryDefault: value,
  //     category,
  //   });
  // }

  handleChangeState(value) {
    this.setState({
      state: value,
    });
  }

  handleChangeSearchState(searchState) {
    this.setState(
      {
        searchState,
      },
      () => {
        this.handleSearch();
      }
    );
  }

  handleChangeSearchKeyword(event) {
    this.setState({
      searchKeyword: event.target.value,
    });
  }

  handleChangePageParam(pageNum, pageSize) {
    this.setState(
      {
        pageNum,
        pageSize,
      },
      () => {
        this.handleSearch();
      }
    );
  }

  showModal = record => {
    if (record._id) {
      const { dispatch } = this.props;
      const params = {
        id: record._id,
      };
      new Promise(resolve => {
        dispatch({
          type: 'news/getNewsDetail',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        // console.log('res :', res)
        const newsTagArr = [];
        if (res.data.newsTag.length) {
          for (let i = 0; i < res.data.newsTag.length; i++) {
            const e = res.data.newsTag[i];
            newsTagArr.push(e._id);
          }
        }
        const newsTag = newsTagArr.length ? newsTagArr.join() : '';
        // const categoryArr = [];
        // if (res.data.category.length) {
        //   for (let i = 0; i < res.data.category.length; i++) {
        //     const e = res.data.category[i];
        //     categoryArr.push(e._id);
        //   }
        // }
        // const category = categoryArr.length ? categoryArr.join() : '';
        console.log('newsTagArr :', newsTagArr);
        // console.log('categoryArr :', categoryArr);
        if (res.code === 0) {
          this.setState({
            visible: true,
            changeType: true,
            title: res.data.title,
            content: res.data.content,
            state: res.data.state,
            author: res.data.author,
            keyword: res.data.keyword,
            desc: res.data.desc,
            img_url: res.data.img_url,
            origin: res.data.origin, // 0 原创，1 转载，2 混合
            newsTag,
            // category,
            newsTagDefault: newsTagArr,
            // categoryDefault: categoryArr,
          });
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      this.setState({
        visible: true,
        changeType: false,
        title: '',
        author: '',
        keyword: '',
        content: '',
        desc: '',
        img_url: '',
        origin: 0, // 0 原创，1 转载，2 混合
        state: 1, // 文章发布状态 => 0 草稿，1 已发布
        type: 1, // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
        newsTag: '',
        // category: '',
      });
    }
  };

  handleOk = () => {
    this.handleSubmit();
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleSearch = () => {
    this.setState({
      loading: true,
    });
    const { dispatch } = this.props;
    const params = {
      keyword: this.state.searchKeyword,
      state: this.state.searchState,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    new Promise(resolve => {
      dispatch({
        type: 'news/queryNews',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      // console.log('res :', res);
      if (res.code === 0) {
        this.setState({
          loading: false,
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  handleDelete = (text, record) => {
    // console.log('text :', text);
    // console.log('record :', record);
    const { dispatch } = this.props;
    const params = {
      id: record._id,
    };
    new Promise(resolve => {
      dispatch({
        type: 'news/delNews',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      // console.log('res :', res);
      if (res.code === 0) {
        notification.success({
          message: res.message,
        });
        this.handleSearch(this.state.pageNum, this.state.pageSize);
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  renderSimpleForm() {
    return (
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem>
              <Search
                placeholder="请输入资讯/描述"
                value={this.state.searchKeyword}
                onSearch={this.handleSearch}
                onChange={this.handleChangeSearchKeyword}
                style={{ width: 260 }}
              />
            </FormItem>

            <Select
              style={{ width: 140 }}
              placeholder="选择资讯状态"
              onChange={this.handleChangeSearchState}
            >
              {/* 文章发布状态 => 0 草稿，1 已发布'' 代表所有文章 */}
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="0">草稿</Select.Option>
              <Select.Option value="1">已发布</Select.Option>
            </Select>

            <span>
              <Button
                onClick={() => {
                  this.showModal(0);
                }}
                style={{ marginTop: '3px', marginLeft: '20px' }}
                type="primary"
              >
                新增资讯
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { newsList, total } = this.props.news;
    const { pageNum, pageSize } = this.state;
    const pagination = {
      total,
      defaultCurrent: pageNum,
      pageSize,
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => {
        // console.log('current, pageSize :', current, pageSize);
        this.handleChangePageParam(current, pageSize);
      },
      onChange: (current, pageSize) => {
        this.handleChangePageParam(current, pageSize);
      },
    };

    return (
      <PageHeaderWrapper title="健康资讯管理">
        <Card bordered={false}>
          <div className="">
            <div className="">{this.renderSimpleForm()}</div>
            <Table
              pagination={pagination}
              loading={this.state.loading}
              pagination={pagination}
              rowKey={record => record._id}
              columns={this.state.columns}
              dataSource={newsList}
              scroll={{ x: 1500, y: 500 }}
            />
          </div>
        </Card>

        <NewsComponent
          changeType={this.state.changeType}
          title={this.state.title}
          author={this.state.author}
          content={this.state.content}
          state={this.state.state}
          type={this.state.type}
          keyword={this.state.keyword}
          origin={this.state.origin}
          desc={this.state.desc}
          img_url={this.state.img_url}
          visible={this.state.visible}
          newsTagDefault={this.state.newsTagDefault}
          // categoryDefault={this.state.categoryDefault}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleChange={this.handleChange}
          handleChangeAuthor={this.handleChangeAuthor}
          handleChangeState={this.handleChangeState}
          handleChangeOrigin={this.handleChangeOrigin}
          handleChangeContent={this.handleChangeContent}
          handleChangeKeyword={this.handleChangeKeyword}
          handleChangeDesc={this.handleChangeDesc}
          handleChangeImgUrl={this.handleChangeImgUrl}
          // handleCategoryChange={this.handleCategoryChange}
          handleNewsTagChange={this.handleNewsTagChange}
          handleChangeType={this.handleChangeType}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
