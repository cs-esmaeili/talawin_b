const { Router } = require("express");

const smsTemplate = require("../controllers/smsTemplate");

const router = new Router();

router.post("/createSmsTemplate", smsTemplate.createSmsTemplate);
router.post("/deleteSmsTemplate", smsTemplate.deleteSmsTemplate);
router.post("/SmsTemplateList", smsTemplate.SmsTemplateList);

module.exports = router;