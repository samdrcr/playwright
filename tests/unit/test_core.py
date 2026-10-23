import unittest
import core

class TestCoreLogic(unittest.TestCase):
    def setUp(self):
        core.clear_tasks()

    def test_add_task_valid(self):
        task = core.add_task("Buy groceries", "Milk and eggs")
        self.assertEqual(task["title"], "Buy groceries")
        self.assertEqual(task["status"], "pending")

    def test_add_task_invalid_title(self):
        with self.assertRaises(ValueError):
            core.add_task("")

if __name__ == "__main__":
    unittest.main()
