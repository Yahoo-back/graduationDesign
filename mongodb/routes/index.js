/*
*所有的路由接口
*/
const user = require('./user');
const article = require('./article');
const comment = require('./comment');
const message = require('./message');
const tag = require('./tag');
const link = require('./link');
const category = require('./category');
const timeAxis = require('./timeAxis');
const news = require('./news')
const newsTag = require('./newsTag');

module.exports = app => {
	app.post('/login', user.login);
	app.post('/logout', user.logout);
	app.post('/loginAdmin', user.loginAdmin);
	app.post('/register', user.register);
	app.post('/delUser', user.delUser);
	app.get('/currentUser', user.currentUser);
	app.get('/getUserList', user.getUserList);
	app.post('/updateUser', user.updateUser);
	app.post('/getUserDetail',user.getUserDetail);

	app.post('/addComment', comment.addComment);
	app.post('/addThirdComment', comment.addThirdComment);
	app.post('/changeComment', comment.changeComment);
	app.post('/changeThirdComment', comment.changeThirdComment);
	app.get('/getCommentList', comment.getCommentList);

	app.post('/addArticle', article.addArticle);
	app.post('/updateArticle', article.updateArticle);
	app.post('/delArticle', article.delArticle);
	app.get('/getArticleList', article.getArticleList);
	app.get('/getArticleListAdmin', article.getArticleListAdmin);
	app.post('/getArticleDetail', article.getArticleDetail);
	app.post('/likeArticle', article.likeArticle);

	app.post('/addNews', news.addNews);
	app.post('/updateNews', news.updateNews);
	app.post('/delNews', news.delNews);
	app.get('/getNewsList', news.getNewsList);
	app.get('/getNewsListAdmin', news.getNewsListAdmin);
	app.post('/getNewsDetail', news.getNewsDetail);
	app.post('/likeNews', news.likeNews);

	app.post('/addTag', tag.addTag);
	app.post('/delTag', tag.delTag);
	app.get('/getTagList', tag.getTagList);

	app.post('/addnewsTag', newsTag.addnewsTag);
	app.post('/delnewsTag', newsTag.delnewsTag);
	app.get('/getnewsTagList', newsTag.getnewsTagList);

	app.post('/addMessage', message.addMessage);
	app.post('/addReplyMessage', message.addReplyMessage);
	app.post('/delMessage', message.delMessage);
	app.post('/getMessageDetail', message.getMessageDetail);
	app.get('/getMessageList', message.getMessageList);

	app.post('/addLink', link.addLink);
	app.post('/updateLink', link.updateLink);
	app.post('/delLink', link.delLink);
	app.get('/getLinkList', link.getLinkList);

	app.post('/addCategory', category.addCategory);
	app.post('/delCategory', category.delCategory);
	app.get('/getCategoryList', category.getCategoryList);

	app.post('/addTimeAxis', timeAxis.addTimeAxis);
	app.post('/updateTimeAxis', timeAxis.updateTimeAxis);
	app.post('/delTimeAxis', timeAxis.delTimeAxis);
	app.get('/getTimeAxisList', timeAxis.getTimeAxisList);
	app.post('/getTimeAxisDetail', timeAxis.getTimeAxisDetail);
};
