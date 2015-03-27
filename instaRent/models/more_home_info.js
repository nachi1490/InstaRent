var mongoose = require("./mongoose_connector").mongoose;
var db = require("./mongoose_connector").db;

var moreHomeInfo = new mongoose.Schema({
  userId: String,
  address: String,
  landlordEmail: String,
  leaseStartDate: Date,
  leaseEndDate: Date,
  rentPerMonth: Number,
  securityDeposit: Number
});

var MoreHomeInfo = mongoose.model('MoreHomeInfo', moreHomeInfo);

function checkAndSave(home, res) {
	
	MoreHomeInfo.find({userId : home.userId, address : home.address}, function(err, data) {
		console.log(data);
		if(err || data.length > 0)
			res.status(409).send("Error: Address already exists");
		else
			home.save(function(err, saved) {
				if(err)
					res.status(409).send("Error Adding home");
				res.send("Success");
			});	
	});	
}; 

function getUserHomeAddresses(userId, res) {
	MoreHomeInfo.find({userId: userId}, function(err, data) {		
		if(err || data.length == 0)
			res.status(409).send({status: "Error", response: "Error: No homes added!"});
		
		var addresses = [];
		for(var i = 0; i < data.length; i++) {
			addresses.push({address: data[i].address, id: data[i]._id, userType: "Tenant"});
		}
		res.send({status: "Success", response: addresses});
	});
};

exports.getUserHomeAddresses = getUserHomeAddresses;
exports.checkAndSave = checkAndSave;
exports.MoreHomeInfo = MoreHomeInfo;