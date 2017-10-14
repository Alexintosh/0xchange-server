var db = require('../../shared/db.js');
var zeroEx = require('../../shared/zeroEx.js');

// TODO: Verify this
module.exports.getAll = function(req, res) {
  db.query('SELECT * FROM orders').then((result) => {
    res.send(result.rows);
  }).catch((err) => {
    res.status(400).send('Failed to get orders');
  });
}

// TODO: Also verify this
module.exports.getPage = function(req, res) {
  db.query('SELECT * FROM orders').then((result) => {
    var pageLen = req.params.pageLen;
    var pageNum = req.params.pageNum;
    var page = [];
    for (var i = pageLen*pageNum ; i < pageLen*(pageNum+1); i++) {
      try {
        page.push(result.rows[i]);
      } catch (err) {
        break;
      }
    }
    res.send(page);
  }).catch((err) => {
    res.status(400).send('Failed to get orders');
  });
}

module.exports.new = function(req, res) {
  var order = req.body;
  zeroEx.exchange.validateOrderFillableOrThrowAsync(order).then(() => {
    return db.query(
      `INSERT INTO orders(
        orderObj,
        makerFee,
        makerTokenAddress,
        makerTokenAmount,
        takerFee,
        takerTokenAddress,
        takerTokenAmount
      ) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        order,
        order.makerFee.toString(16),
        order.makerTokenAddress,
        order.makerTokenAmount.toString(16),
        order.takerFee.toString(16),
        order.takerTokenAddress,
        order.takerTokenAmount.toString(16)
      ]
    );
  }).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.status(400).send('Failed to post order');
  });
}