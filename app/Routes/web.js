const AdminController = require('../Controllers/AdminController');
const CandidateController = require('../Controllers/CandidateController')
const UserController = require('../Controllers/UserController')
const AdminMiddleware = require('../Middlewares/AdminMiddleware');
const SessionMiddleware = require('../Middlewares/SessionMiddleware');
const IsActStartMiddleware = require('../Middlewares/IsActStartMiddleware');

module.exports = function (router) {
  //获取候选人列表
  router.get('/api/v1/candidates', CandidateController.candidates);

  //新增候选人
  router.put('/api/v1/candidate', SessionMiddleware, AdminMiddleware, CandidateController.create);

  //删除候选人
  router.delete('/api/v1/candidate/:cuid', SessionMiddleware, AdminMiddleware, CandidateController.dropCandidate);

  //修改候选人信息
  router.post('/api/v1/candidate/:cuid', SessionMiddleware, AdminMiddleware, CandidateController.edit);

  //管理员设置投票时间
  router.post('/api/v1/admin/acttime', SessionMiddleware, AdminMiddleware, AdminController.setActTime);

  //管理员查看投票时间
  router.get('/api/v1/admin/acttime', SessionMiddleware, AdminMiddleware, AdminController.getActTime);

  //用户登录接口
  router.post('/api/v1/user/login', IsActStartMiddleware, UserController.login);

  //用户激活接口
  router.get('/api/v1/user/active/:urltoken', IsActStartMiddleware, UserController.active);

  //用户投票接口
  router.post('/api/v1/user/vote', IsActStartMiddleware, SessionMiddleware, UserController.vote);
}