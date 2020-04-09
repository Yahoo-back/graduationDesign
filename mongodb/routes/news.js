import News from '../models/News';
import User from '../models/user';
import { responseClient, timestampToTime } from '../util/util';

exports.addNews = (req, res) => {
	// if (!req.session.userInfo) {
	// 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
	// 	return;
	// }
	const { title, author, keyword, content, desc, img_url, newsTag,  state, type, origin } = req.body;
	let tempNews = null
	if(img_url){
		tempNews = new News({
			title,
			author,
			keyword: keyword ? keyword.split(',') : [],
			content,
			numbers: content.length,
			desc,
			img_url,
			newsTag: newsTag ? newsTag.split(',') : [],
			// category: category ? category.split(',') : [],
			state,
			type,
			origin,
		});
	}else{
		tempNews = new News({
			title,
			author,
			keyword: keyword ? keyword.split(',') : [],
			content,
			numbers: content.length,
			desc,
			newsTag: newsTag ? newsTag.split(',') : [],
			// category: category ? category.split(',') : [],
			state,
			type,
			origin,
		});
	}
	
	tempNews
		.save()
		.then(data => {
			// let News = JSON.parse(JSON.stringify(data));
			// console.log('News :', News);
			// News.create_time = timestampToTime(News.create_time);
			// News.update_time = timestampToTime(News.update_time);
			// console.log('timestampToTime :', timestampToTime(data.create_time));
			responseClient(res, 200, 0, '保存成功', data);
		})
		.catch(err => {
			console.log(err);
			responseClient(res);
		});
};

exports.updateNews = (req, res) => {
	// if (!req.session.userInfo) {
	// 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
	// 	return;
	// }
	const { title, author, keyword, content, desc, img_url, newsTag, category, state, type, origin, id } = req.body;
	News.update(
		{ _id: id },
		{
			title,
			author,
			keyword: keyword ? keyword.split(','): [],
			content,
			desc,
			img_url,
			newsTag: newsTag ? newsTag.split(',') : [],
			// category:category ? category.split(',') : [],
			state,
			type,
			origin,
		},
	)
		.then(result => {
			responseClient(res, 200, 0, '操作成功', result);
		})
		.catch(err => {
			console.error(err);
			responseClient(res);
		});
};

exports.delNews = (req, res) => {
	let { id } = req.body;
	News.deleteMany({ _id: id })
		.then(result => {
			if (result.n === 1) {
				responseClient(res, 200, 0, '删除成功!');
			} else {
				responseClient(res, 200, 1, '文章不存在');
			}
		})
		.catch(err => {
			console.error('err :', err);
			responseClient(res);
		});
};

// 前台文章列表
exports.getNewsList = (req, res) => {
	let keyword = req.query.keyword || null;
	let state = req.query.state || '';
	let likes = req.query.likes || '';
	let newsTag_id = req.query.newsTag_id || '';
	// let category_id = req.query.category_id || '';
	let pageNum = parseInt(req.query.pageNum) || 1;
	let pageSize = parseInt(req.query.pageSize) || 10;
	let conditions = {};
	if (!state) {
		if (keyword) {
			const reg = new RegExp(keyword, 'i'); //不区分大小写
			conditions = {
				$or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
			};
		}
	} else if (state) {
		state = parseInt(state);
		if (keyword) {
			const reg = new RegExp(keyword, 'i');
			conditions = {
				$and: [
					{ $or: [{ state: state }] },
					{ $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }, { keyword: { $regex: reg } }] },
				],
			};
		} else {
			conditions = { state };
		}
	}

	let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
	let responseData = {
		count: 0,
		list: [],
	};
	News.countDocuments(conditions, (err, count) => {
		if (err) {
			console.log('Error:' + err);
		} else {
			responseData.count = count;
			// 待返回的字段
			let fields = {
				title: 1,
				author: 1,
				keyword: 1,
				content: 1,
				desc: 1,
				img_url: 1,
				newsTag: 1,
				// category: 1,
				state: 1,
				type: 1,
				origin: 1,
				// comments: 1,
				like_User_id: 1,
				meta: 1,
				create_time: 1,
				update_time: 1,
			};
			let options = {
				skip: skip,
				limit: pageSize,
				sort: { create_time: -1 },
			};
			News.find(conditions, fields, options, (error, result) => {
				if (err) {
					console.error('Error:' + error);
					// throw error;
				} else {
					let newList = [];
					if (likes) {
						// 根据热度 likes 返回数据
						result.sort((a, b) => {
							return b.meta.likes - a.meta.likes;
						});
						responseData.list = result;
					} 
					// else if (category_id) {
					// 	// 根据 分类 id 返回数据
					// 	result.forEach(item => {
					// 		if (item.category.indexOf(category_id) > -1) {
					// 			newList.push(item);
					// 		}
					// 	});
					// 	let len = newList.length;
					// 	responseData.count = len;
					// 	responseData.list = newList;
					// } 
					else if (newsTag_id) {
						// 根据标签 id 返回数据
						result.forEach(item => {
							if (item.newsTag.indexOf(newsTag_id) > -1) {
								newList.push(item);
							}
						});
						let len = newList.length;
						responseData.count = len;
						responseData.list = newList;
					} else {
						responseData.list = result;
					}
					responseClient(res, 200, 0, '操作成功！', responseData);
				}
			});
		}
	});
};

// 后台文章列表
exports.getNewsListAdmin = (req, res) => {
	let keyword = req.query.keyword || null;
	let state = req.query.state || '';
	let likes = req.query.likes || '';
	let pageNum = parseInt(req.query.pageNum) || 1;
	let pageSize = parseInt(req.query.pageSize) || 10;
	let conditions = {};
	if (!state) {
		if (keyword) {
			const reg = new RegExp(keyword, 'i'); //不区分大小写
			conditions = {
				$or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
			};
		}
	} else if (state) {
		state = parseInt(state);
		if (keyword) {
			const reg = new RegExp(keyword, 'i');
			conditions = {
				$and: [
					{ $or: [{ state: state }] },
					{ $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }, { keyword: { $regex: reg } }] },
				],
			};
		} else {
			conditions = { state };
		}
	}

	let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
	let responseData = {
		count: 0,
		list: [],
	};
	News.countDocuments(conditions, (err, count) => {
		if (err) {
			console.log('Error:' + err);
		} else {
			responseData.count = count;
			// 待返回的字段
			let fields = {
				title: 1,
				author: 1,
				keyword: 1,
				content: 1,
				desc: 1,
				img_url: 1,
				newsTag: 1,
				// category: 1,
				state: 1,
				type: 1,
				origin: 1,
				// comments: 1,
				like_User_id: 1,
				meta: 1,
				create_time: 1,
				update_time: 1,
			};
			let options = {
				skip: skip,
				limit: pageSize,
				sort: { create_time: -1 },
			};
			News.find(conditions, fields, options, (error, result) => {
				if (err) {
					console.error('Error:' + error);
					// throw error;
				} else {
					if (likes) {
						result.sort((a, b) => {
							return b.meta.likes - a.meta.likes;
						});
					}
					responseData.list = result;
					responseClient(res, 200, 0, '操作成功！', responseData);
				}
			})
				.populate([
					{ path: 'newsTag', },
					// { path: 'comments',  },
					// { path: 'category',  },
				])
				.exec((err, doc) => {
					// console.log("doc:");          // aikin
					// console.log("doc.tags:",doc.tags);          // aikin
					// console.log("doc.category:",doc.category);           // undefined
				});
		}
	});
};

// 文章点赞
exports.likeNews = (req, res) => {
	if (!req.session.userInfo) {
		responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
		return;
	}
	let { id, user_id } = req.body;
	News.findOne({ _id: id })
		.then(data => {
			let fields = {};
			data.meta.likes = data.meta.likes + 1;
			fields.meta = data.meta;
			let like_users_arr = data.like_users.length ? data.like_users : [];
			User.findOne({ _id: user_id })
				.then(user => {
					let new_like_user = {};
					new_like_user.id = user._id;
					new_like_user.name = user.name;
					new_like_user.avatar = user.avatar;
					new_like_user.create_time = user.create_time;
					new_like_user.type = user.type;
					new_like_user.introduce = user.introduce;
					like_users_arr.push(new_like_user);
					fields.like_users = like_users_arr;
					News.update({ _id: id }, fields)
						.then(result => {
							responseClient(res, 200, 0, '操作成功！', result);
						})
						.catch(err => {
							console.error('err :', err);
							throw err;
						});
				})
				.catch(err => {
					responseClient(res);
					console.error('err 1:', err);
				});
		})
		.catch(err => {
			responseClient(res);
			console.error('err 2:', err);
		});
};

// 文章详情
exports.getNewsDetailByType = (req, res) => {
	let { type } = req.body;
	if (!type) {
		responseClient(res, 200, 1, '文章不存在 ！');
		return;
	}
	News.findOne({ type: type }, (Error, data) => {
		if (Error) {
			console.error('Error:' + Error);
			// throw error;
		} else {
			data.meta.views = data.meta.views + 1;
			News.updateOne({ type: type }, { meta: data.meta })
				.then(result => {
					responseClient(res, 200, 0, '操作成功 ！', data);
				})
				.catch(err => {
					console.error('err :', err);
					throw err;
				});
		}
	})
		.populate([
			{ path: 'newsTag', select: '-_id' },
			// { path: 'category', select: '-_id' },
			// { path: 'comments', select: '-_id' },
		])
		.exec((err, doc) => {
			// console.log("doc:");          // aikin
			// console.log("doc.tags:",doc.tags);          // aikin
			// console.log("doc.category:",doc.category);           // undefined
		});
};

// 文章详情
exports.getNewsDetail = (req, res) => {
	let { id } = req.body;
	let type = Number(req.body.type) || 1; //文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
	console.log('type:', type);
	if (type === 1) {
		if (!id) {
			responseClient(res, 200, 1, '新闻不存在 ！');
			return;
		}
		News.findOne({ _id: id }, (Error, data) => {
			if (Error) {
				console.error('Error:' + Error);
				// throw error;
			} else {
				data.meta.views = data.meta.views + 1;
				News.updateOne({ _id: id }, { meta: data.meta })
					.then(result => {
						responseClient(res, 200, 0, '操作成功 ！', data);
					})
					.catch(err => {
						console.error('err :', err);
						throw err;
					});
			}
		})
			.populate([
				{ path: 'newsTag',  },
				// { path: 'category',  },
				// { path: 'comments',  },
			])
			.exec((err, doc) => {
				// console.log("doc:");          // aikin
				// console.log("doc.tags:",doc.tags);          // aikin
				// console.log("doc.category:",doc.category);           // undefined
			});
	} else {
		News.findOne({ type: type }, (Error, data) => {
			if (Error) {
				console.log('Error:' + Error);
				// throw error;
			} else {
				if (data) {
					data.meta.views = data.meta.views + 1;
					News.updateOne({ type: type }, { meta: data.meta })
						.then(result => {
							responseClient(res, 200, 0, '操作成功 ！', data);
						})
						.catch(err => {
							console.error('err :', err);
							throw err;
						});
				} else {
					responseClient(res, 200, 1, '新闻不存在 ！');
					return;
				}
			}
		})
			.populate([
				{ path: 'newsTag',  },
				// { path: 'category',  },
				// { path: 'comments',  },
			])
			.exec((err, doc) => {
				// console.log("doc:");          // aikin
				// console.log("doc.tags:",doc.tags);          // aikin
				// console.log("doc.category:",doc.category);           // undefined
			});
	}
};
