import unittest
import threading
import urllib.request
import json
from http.server import HTTPServer
from server import TaskBoardHandler
import core

class TestSystemAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = HTTPServer(('127.0.0.1', 0), TaskBoardHandler)
        cls.port = cls.server.server_port
        cls.thread = threading.Thread(target=cls.server.serve_forever)
        cls.thread.daemon = True
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        core.clear_tasks()

    def test_get_tasks_endpoint(self):
        core.add_task("Test task")
        url = f"http://127.0.0.1:{self.port}/api/tasks"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(len(data), 1)
            self.assertEqual(data[0]['title'], "Test task")

if __name__ == "__main__":
    unittest.main()
