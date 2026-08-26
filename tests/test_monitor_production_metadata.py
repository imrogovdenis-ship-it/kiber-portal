import importlib.util
import sys
import unittest
from unittest import mock
from pathlib import Path

MODULE_PATH = Path(__file__).parents[1] / "scripts" / "monitor_production_metadata.py"
SPEC = importlib.util.spec_from_file_location("monitor", MODULE_PATH)
monitor = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
sys.modules[SPEC.name] = monitor
SPEC.loader.exec_module(monitor)


class MetadataMonitorTests(unittest.TestCase):
    def test_extracts_metadata(self):
        parser = monitor.MetadataParser()
        parser.feed('<html><head><title>  Hello  world </title><link rel="canonical" href="/page"></head><body><h1> Main <b>heading</b></h1><h1>Ignored</h1></body></html>')
        self.assertEqual(monitor.normalized_text(parser.title_parts), "Hello world")
        self.assertEqual(monitor.normalized_text(parser.h1_parts), "Main heading")
        self.assertEqual(parser.canonical, "/page")

    def test_reports_added_removed_and_changed(self):
        old = {"a": monitor.PageMetadata("a", "Old", "H1", "a") , "b": monitor.PageMetadata("b", "B", "B", "b")}
        new = {"a": monitor.PageMetadata("a", "New", "H1", "a") , "c": monitor.PageMetadata("c", "C", "C", "c")}
        changes = monitor.compare(old, new)
        self.assertEqual([(item["url"], item["field"]) for item in changes], [("a", "title"), ("b", "url"), ("c", "url")])

    @mock.patch.object(monitor.time, "sleep")
    @mock.patch.object(monitor.urllib.request, "urlopen")
    def test_retries_transient_http_error(self, urlopen, sleep):
        headers = {"Retry-After": "1"}
        response = mock.MagicMock()
        response.__enter__.return_value.read.return_value = b"ok"
        urlopen.side_effect = [monitor.urllib.error.HTTPError("https://example.test", 429, "rate limited", headers, None), response]
        self.assertEqual(monitor.fetch("https://example.test", 1), b"ok")
        sleep.assert_called_once_with(1.0)


if __name__ == "__main__":
    unittest.main()
