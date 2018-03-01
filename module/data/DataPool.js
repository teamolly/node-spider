/**
 * Created by Administrator on 2018/2/24 0024.
 */

var ArticlePool = require("./ArticlePool");
var AnswerPool = require("./AnswerPool");
var HousePool = require("./HousePool");
var articlePool = new ArticlePool();
var answerPool = new AnswerPool();
var housePool = new HousePool();
module.exports = {
	articlePool: articlePool,
	answerPool: answerPool,
	housePool: housePool
}