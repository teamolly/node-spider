/**
 * Created by Administrator on 2018/2/24 0024.
 */

var ArticlePool = require("./ArticlePool");
var AnswerPool = require("./AnswerPool");
var articlePool = new ArticlePool();
var answerPool = new AnswerPool();
module.exports = {
	articlePool: articlePool,
	answerPool: answerPool
}