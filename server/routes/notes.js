const express = require('express');
const router = express.Router();
const {check} = require('express-validator')

const noteController = require("../controllers/noteController");

router.post('/:noteId', noteController.createEditeNote);
router.post('/', [], noteController.createEditeNote);
router.get('/:noteId', noteController.getNote);

module.exports = router;