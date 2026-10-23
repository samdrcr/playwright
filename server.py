import json
import argparse
from http.server import SimpleHTTPRequestHandler, HTTPServer
import core

class TaskBoardHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/tasks':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(core.get_tasks()).encode())
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/tasks':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            try:
                task = core.add_task(data.get('title', ''), data.get('description', ''))
                self.send_response(201)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(task).encode())
            except ValueError as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    
    server = HTTPServer(('127.0.0.1', args.port), TaskBoardHandler)
    print(f"Task Board running on http://127.0.0.1:{args.port}")
    server.serve_forever()
