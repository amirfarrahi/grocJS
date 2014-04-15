var productschema=require('../models/product.js');
var storeschema=require('../models/store.js');
var userschema=require('../models/user.js');
var dealschema=require('../models/deal.js');
var events = require('events');
var EventEmitter = events.EventEmitter;

exports.index = function(req, res) {
    dealschema.find({}).populate('store').populate('product').populate('user').exec(function(err,dealslist) {
    if (err) res.json(err);
    else res.render('deals', { title: 'deals info',Deals:dealslist });
    });
};

exports.new = function(req, res) {

  var flowController = new EventEmitter();
  flowController.on('finished', function (storelist,productlist,userlist,err) {
    res.render('adddeal', { title: 'adding a deal', Storelist:storelist,Productlist:productlist,Userlist:userlist,error:err});
  });
  flowController.on('getstoreslist', function () {
    	storeschema.find( function(err, storeslist){
    	if (err)  flowController.emit('finished', null,null,null,err);
		 else flowController.emit('getproductslist',storeslist );
    }); 
  });
  flowController.on('getproductslist', function (storelist) {
    	productschema.find( function(err, productslist){
        if (err)  flowController.emit('finished', storelist,null,null,err);
    	else flowController.emit('getuserslist', storelist,productslist);
    }); 
  });
  flowController.on('getuserslist', function (storelist,productlist) {
    	userschema.find( function(err, userslist){
    	flowController.emit('finished', storelist,productlist,userslist,err);
    }); 
  });
  flowController.emit('getstoreslist', 0);
};

exports.create = function(req, res) {
  dealschema.create(req.body, function(err, deal) {
     if (err) console.log(err);
     res.redirect('/deals/new');
				});
};

exports.show = function(req, res) {
        dealschema.findOne({_id:req.params.deal}).populate('store').populate('product').populate('user').exec(function(err,deal) {
        if (err) res.json(err);
		else res.render('deal', { title: 'deal info',selectedDeal:deal });
    }); 
};

exports.edit = function(req, res) {
  var flowController = new EventEmitter();
  flowController.on('finished', function (storelist,productlist,userlist,err) {
    dealschema.findOne({_id:req.params.deal}).populate('store').populate('product').populate('user').exec(function(err,deal) {
        if (err) res.json(err);
        else res.render('editdeal', { title: 'editing a deal', Storelist:storelist,Productlist:productlist,
        Userlist:userlist,selectedDeal:deal,error:err}); });
     
  });
  flowController.on('getstoreslist', function () {
    	storeschema.find( function(err, storeslist){
    	if (err)  flowController.emit('finished', null,null,null,err);
		 else flowController.emit('getproductslist',storeslist );
    }); 
  });
  flowController.on('getproductslist', function (storelist) {
    	productschema.find( function(err, productslist){
        if (err)  flowController.emit('finished', storelist,null,null,err);
    	else flowController.emit('getuserslist', storelist,productslist);
    }); 
  });
  flowController.on('getuserslist', function (storelist,productlist) {
    	userschema.find( function(err, userslist){
    	flowController.emit('finished', storelist,productlist,userslist,err);
    }); 
  });
  flowController.emit('getstoreslist', 0);

};

exports.update = function(req, res) {
          return dealschema.findByIdAndUpdate(req.params.deal, { $set:req.body }, function (err, updateddeal) {
  	      if (err) return handleError(err);
          res.redirect('/deals');
          });
};

exports.destroy = function(req, res) {
	return dealschema.findById(req.params.deal, function (err, deal) {
    return deal.remove(function (err) {
      if (!err) {
        res.redirect('/deals');
      } else {
        console.log(err);
      }
    });
  });
};
