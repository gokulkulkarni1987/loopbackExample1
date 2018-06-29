'use strict';

module.exports = function(app) {
  var Role = app.models.Role;
  console.log('*********************', Role);
  Role.gokul();
  Role.registerResolver('eventAdmin', function(role, context, cb) {
    console.log('********************* this is called', context);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    if (context.modelName !== 'event') {
      return reject();
    }

    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    var event = context.model;
    var chapterId = event.chapterId;

    var Admin = app.models.Admin;
    Admin.count({
      ngoMemberId: userId,
      ngoId: event.ngoId,
    }, function(err, count) {
      if (err) {
        return cb(null, false);
      }
      if (count > 0) {
        return cb(null, true);
      }
      Admin.count({
        ngoMemberId: userId,
        chapterId: event.chapterId,
      }, function(err, count) {
        if (err) {
          return cb(null, false);
        }
        return cb(null, count > 0);
      });
    });
  });
};
