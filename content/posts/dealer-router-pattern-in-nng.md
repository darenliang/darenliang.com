---
title: "Dealer Router Pattern in NNG"
description: "An example implementation of the dealer router pattern in NNG."
date: "2024-01-12"
showthedate: true
tags: [ "programming" ]
---

[NNG](https://nng.nanomsg.org/) is a broker-less message queue that is a
lightweight alternative to [ZeroMQ](https://zeromq.org/) and supersedes the
older [nanomsg](https://nanomsg.org/) project. It offers a
more "[orthogonal](https://en.wikipedia.org/wiki/Orthogonality_(programming))"
API and does a few things better than ZeroMQ.

* Thread-safe sockets
* Websocket transport support
* POSIX-compliant sockets API
* True zero-copy messaging
* ... and much more

A common messaging pattern is Dealer-Router which can be easily implemented
using ZeroMQ's DEALER and ROUTER sockets. Unfortunately, NNG does not have such
sockets and implementing the pattern is not
[trivial](https://github.com/nanomsg/nng/issues/781). Fortunately, using NNG's
raw mode sockets we can emulate Dealer-Router.

### How to implement Dealer-Router in NNG

Let's first import [pynng](https://github.com/codypiersall/pynng):

```python
import pynng
```

Each message sent from a dealer (or request) contains a header used by the
router to route a message back to the dealer. We can define a function to
extract this header:

```python
def extract_header(msg: pynng.Message) -> bytes:
    header_p = pynng.lib.nng_msg_header(msg._nng_msg)
    size = pynng.lib.nng_msg_header_len(msg._nng_msg)
    return bytes(pynng.ffi.buffer(header_p, size))
```

We can define helper functions to create dealer request messages and router
reply messages. A "cooked" socket handles the header automatically but because
we're using raw sockets, we'll have to modify the header ourselves.

```python
def create_request_message(data: bytes) -> pynng.Message:
    msg = pynng.Message(data)
    pynng.lib.nng_msg_header_append_u32(msg._nng_msg, 0x80000000)
    return msg


def create_reply_message(header: bytes, data: bytes) -> pynng.Message:
    msg = pynng.Message(data)
    pynng.lib.nng_msg_header_append(msg._nng_msg, header, len(header))
    return msg
```

Now we can open our raw sockets for Dealer-Router:

```python
router = pynng.Rep0(opener=pynng.lib.nng_rep0_open_raw)
router.listen("tcp://127.0.0.1:8000")

dealer = pynng.Req0(opener=pynng.lib.nng_req0_open_raw)
dealer.dial("tcp://127.0.0.1:8000")
```

Sending one message from the dealer, we can see the router receives the
message:

```python
dealer.send_msg(create_request_message(b"one"))

msg = router.recv_msg()
assert msg.bytes == b"one"
```

To reply to the dealer, we need to extract the header and send reply messages
using the extracted header:

```python
header = extract_header(msg)

router.send_msg(create_reply_message(header, b"two"))
router.send_msg(create_reply_message(header, b"three"))

msg = dealer.recv_msg()
assert msg.bytes == b"two"
msg = dealer.recv_msg()
assert msg.bytes == b"three"
```

### Message Polling

To poll messages from the router, we can use
Python's [select](https://docs.python.org/3/library/select.html#select.select)
module

```python
import select

dealer.send_msg(create_request_message(b"ping"))

select.select([router.recv_fd], [], [router.recv_fd])
msg = router.recv_msg(block=False)
assert msg.bytes == b"ping"

router.send_msg(create_reply_message(extract_header(msg), b"pong"))

select.select([dealer.recv_fd], [], [dealer.recv_fd])
msg = dealer.recv_msg(block=False)
assert msg.bytes == b"pong"
```

### Tracking Dealer Identities

The first 4-bytes of the header is known as the identity (also known as the
peer ID) and uniquely identifies a dealer.

If we open a second dealer, the router can use the identities to differentiate
between messages sent from different dealers.

```python
dealer2 = pynng.Req0(opener=pynng.lib.nng_req0_open_raw)
dealer2.dial("tcp://127.0.0.1:8000")

dealer.send_msg(create_request_message(b"dealer"))
dealer2.send_msg(create_request_message(b"dealer2"))

identities = {}
for _ in range(2):
    msg = router.recv_msg()
    identities[extract_header(msg)[:4]] = msg.bytes

dealer.send_msg(create_request_message(b""))
msg = router.recv_msg()
assert identities[extract_header(msg)[:4]] == b"dealer"

dealer2.send_msg(create_request_message(b""))
msg = router.recv_msg()
assert identities[extract_header(msg)[:4]] == b"dealer2"
```

I hope this quick overview of the Dealer-Router pattern in NNG was helpful.
Message onwards! 📨
