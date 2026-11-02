# -*- coding: utf-8 -*-
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
root=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw): super().__init__(*a,directory=str(root/'dist'),**kw)
 def do_POST(self):
  if self.path not in ['/__qa/adventure.webm','/__qa/paper.webm','/__qa/adventure.png','/__qa/paper.png','/__qa/journal.png']:
   self.send_error(404);return
  n=int(self.headers.get('Content-Length',0))
  if n>40000000:self.send_error(413);return
  target=root/'qa'/self.path.rsplit('/',1)[1]
  target.write_bytes(self.rfile.read(n));self.send_response(200);self.end_headers();self.wfile.write(b'OK')
ThreadingHTTPServer(('127.0.0.1',4175),Handler).serve_forever()
