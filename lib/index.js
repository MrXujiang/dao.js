"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * 数据管理器
 */
var DAO;

(function (win) {
  var BaseLocalStorage = function BaseLocalStorage(preId, timeSign) {
    this.preId = preId;
    this.timeSign = timeSign || '|-|';
  };

  BaseLocalStorage.prototype = {
    status: {
      SUCCESS: 0,
      FAILURE: 1,
      OVERFLOW: 2,
      TIMEOUT: 3
    },
    storage: localStorage || window.localStorage,
    getKey: function getKey(key) {
      return this.preId + key;
    },
    set: function set(key, value, cb, time) {
      var status = this.status.SUCCESS,
          key = this.getKey(key); // 设置失效时间，未设置时间默认为一个月

      try {
        time = new Date(time).getTime() || time.getTime();
      } catch (e) {
        time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
      }

      try {
        this.storage.setItem(key, time + this.timeSign + value);
      } catch (e) {
        status = this.status.OVERFLOW;
      }

      cb && cb.call(this, status, key, value);
    },
    get: function get(key, cb) {
      var status = this.status.SUCCESS,
          key = this.getKey(key),
          value = null,
          timeSignLen = this.timeSign.length,
          that = this,
          index,
          time,
          result;

      try {
        value = that.storage.getItem(key);
      } catch (e) {
        result = {
          status: that.status.FAILURE,
          value: null
        };
        cb && cb.call(this, result.status, result.value);
        return result;
      }

      if (value) {
        index = value.indexOf(that.timeSign);
        time = +value.slice(0, index);

        if (time > new Date().getTime() || time == 0) {
          value = value.slice(index + timeSignLen);
        } else {
          value = null, status = that.status.TIMEOUT;
          that.remove(key);
        }
      } else {
        status = that.status.FAILURE;
      }

      result = {
        status: status,
        value: value
      };
      cb && cb.call(this, result.status, result.value);
      return result;
    },
    // 删除storage，如果删除成功，返回删除的内容
    remove: function remove(key, cb) {
      var status = this.status.FAILURE,
          key = this.getKey(key),
          value = null;

      try {
        value = this.storage.getItem(key);
      } catch (e) {// dosomething
      }

      if (value) {
        try {
          this.storage.removeItem(key);
          status = this.status.SUCCESS;
        } catch (e) {// dosomething
        }
      }

      cb && cb.call(this, status, status > 0 ? null : value.slice(value.indexOf(this.timeSign) + this.timeSign.length));
    }
  };
  DAO = win.DAO = BaseLocalStorage;
})(window);

var _default = DAO;
exports.default = _default;