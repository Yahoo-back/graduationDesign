import { responseClient } from '../util/util';
import newsTag from '../models/newsTag';

//获取全部标签
exports.getnewsTagList = (req, res) => {
	// console.log('req userInfo: ',req.cookies.userInfo)
	// console.log('req userInfo 2: ', unescape(req.cookies.userInfo));
	let keyword = req.query.keyword || null;
	let pageNum = parseInt(req.query.pageNum) || 1;
	let pageSize = parseInt(req.query.pageSize) || 10;
	let conditions = {};
	if (keyword) {
		const reg = new RegExp(keyword, 'i');
		conditions = { $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }] };
	}
	let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
	let responseData = {
		count: 0,
		list: [],
	};
	newsTag.countDocuments(conditions, (err, count) => {
		if (err) {
			console.error('Error:' + err);
		} else {
			responseData.count = count;
			let fields = { name: 1, desc: 1, icon: 1, create_time: 1, update_time: 1 }; // 待返回的字段
			let options = {
				skip: skip,
				limit: pageSize,
				sort: { create_time: -1 },
			};
			newsTag.find(conditions, fields, options, (error, result) => {
				if (err) {
					console.error('Error:' + error);
					// throw error;
				} else {
					responseData.list = result;
					responseClient(res, 200, 0, 'success', responseData);
				}
			});
		}
	});
};
exports.addnewsTag = (req, res) => {
	let { name, desc } = req.body;
	newsTag.findOne({
		name,
	})
		.then(result => {
			if (!result) {
				let newsTags = new newsTag({
					name,
					desc,
				});
				newsTags
					.save()
					.then(data => {
						responseClient(res, 200, 0, '添加成功', data);
					})
					.catch(err => {
						throw err;
					});
			} else {
				responseClient(res, 200, 1, '该标签已存在');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};
exports.delnewsTag = (req, res) => {
	let { id } = req.body;
	newsTag.deleteMany({ _id: id })
		.then(result => {
			if (result.n === 1) {
				responseClient(res, 200, 0, '删除成功!');
			} else {
				responseClient(res, 200, 1, '标签不存在');
			}
		})
		.catch(err => {
			responseClient(res);
		});
};
