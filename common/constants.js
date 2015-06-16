exports.constants = {
  SUCCESS_CODE: '000000',
  ERROR_CODE: {
    NO_USER: {
      status: 1,
      msg: '请注册后操作'
    },
    NEED_LOGIN: {
      status: 1,
      msg: '请登陆后操作'
    },
    NO_TEACHER_AUTH: {
      status: 1,
      msg: '您不是老师，无法进行此操作'
    },
    NO_TEACHER_VERIFY: {
      status: 1,
      msg: '您的账户正在审核，无法进行此操作'
    },
    NO_STUDENT_AUTH: {
      status: 1,
      msg: '您不是学生，无法进行此操作'
    },
    WRONG_ARGS: {
      status: 1,
      msg: '参数错误'
    },
    SERVER_ERROR: {
      status: 1,
      msg: '访问出错'
    },
    SERVER_TIMEOUT: {
      resultcode: '400000',
      resultinfo: '网络超时，请重试'
    },
    WRONG_HEADERS: {
      status: 1,
      msg: 'header不完整'
    },
    AUTH_APPID: {
      status: 1,
      msg: 'APPID无效'
    }
  },
  FILTER_TYPE:{
    NUMBER:1,
    SENSITIVE_WORD:2
  },
  userType: {
    student: 1,
    teacher:2
  },
  topic_catelog: {
    entertainment: 1,
    others:2
  }
};
