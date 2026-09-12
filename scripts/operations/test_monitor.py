import unittest
from monitor import transition, summarize_logs, valid_response
class MonitorTests(unittest.TestCase):
 def test_failure_debounced_and_recovery(self):
  s,ev=transition({},['web']);self.assertEqual(ev,[])
  s,ev=transition(s,['web']);self.assertEqual(ev,['ALERT: web'])
  s,ev=transition(s,['web']);self.assertEqual(ev,[])
  s,ev=transition(s,[]);self.assertEqual(ev,['RECOVERY: web'])
 def test_log_summary_deduplicates_without_pii(self):
  import json
  line=json.dumps({'event':'lead.delivery.completed','status':'failed','mode':'live','requestId':'private','contact':'secret'})
  self.assertEqual(summarize_logs(line+'\n'+line),{'delivered':0,'failed':1})
 def test_body_validation_catches_false_200(self):
  self.assertTrue(valid_response('api','{"ok":true,"mode":"live"}'))
  self.assertFalse(valid_response('api','{"ok":true,"mode":"dry-run"}'))
  self.assertFalse(valid_response('web','<html>Hosting error</html>'))
  self.assertFalse(valid_response('web','<html>КИБЕР ПОРТАЛ noindex</html>'))
  self.assertTrue(valid_response('web','<html>КИБЕР ПОРТАЛ</html>'))
if __name__=='__main__':unittest.main()
