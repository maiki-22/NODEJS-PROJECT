const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

//customer routes

router.get('/', customerController.homepage);
router.get('/add', customerController.addCustomer);
router.post('/add', customerController.postCustomer);

router.get('/edit/:id',customerController.edit);
router.put('/edit/:id',customerController.editPost);
router.delete('/edit/:id',customerController.deleteCustomer);

router.post('/search',customerController.searchCustomers);

module.exports = router;