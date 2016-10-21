function validate(url){
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

module.exports = {
    fetch: function (code,db,res){
        db.findOne({"short_url": code}, { _id: 0}, function(err, urlObj){
            if (err) {console.log(err)}
            if (urlObj){
                res.redirect(urlObj.original_url);
            } else {
                res.send("Error: Cannot find URL");
            }
        });
    },
    save: function (orig, db, res){
        if (validate(orig)){
          db.find({original_url: orig}, function(err, result){
            if (err) {console.log(err)}
            if(result){
              console.log("Url Already shortened");
              db.findOne({original_url: orig}, { _id: 0}, function(err, urlObj){
                if (err) {console.log(err)}
                res.json(urlObj);
              });
            } else {
              db.find({}).count(function(err, size){
                if (err) {console.log(err)}
                var short_url = size + 1;
                var urlObj = {
                  original_url: orig,
                  short_url: short_url
                };
                res.json(urlObj);
                db.insert(urlObj);
              });
            }
          });
        } else {
            return {err: "Invalid URL"};
        }
    }
};