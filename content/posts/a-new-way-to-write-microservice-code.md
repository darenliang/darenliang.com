---
title: "A New Way to Write Microservice Code"
description: "What if each function is its own microservice?"
date: "2024-01-28"
showthedate: true
tags: [ "programming" ]
---

[Microservices](https://en.wikipedia.org/wiki/Microservices) are getting really
popular, but have we reached the pinnacle of microservice design? I've been
imagining a new way to write microservice code where you can annotate functions
you want to be microservices. That way, you get the microservice architecture
***directly*** baked into the code.

Sounds a bit like the new hit buzzword "Infrastructure as code" that everyone
is using.

### Selling the idea

The concept is simple. You can decorate functions that you want to be
highly available, highly durable, highly reliable, highly resilient,
highly fault-tolerant, or anything else scalability preachers might want.

An example of a "microserviced" function in Python:

```python
@microservice()
def is_even(x: int) -> bool:
    return x % 2 == 0
```

Then you can write code that calls this newly created microservice directly
as a function.

```python
x = 5
print(f"Is {x} even: {is_even(x)})

# Is 5 even: False
```

When you want to use microservices in another language or the original
microservice code is not available, you can use the conveniently exposed REST
API. Each microservice can be seen as a server that has only one endpoint.

```bash
curl -X POST https://is_even.microservices.com
     -H 'Content-Type: application/json'
     -d '{"x": 5}'

# false
```

Calling microservices isn't limited to just user code. You can even make
microservices call other microservices:

```python
@microservice()
def is_odd(x: int) -> bool:
    return not is_even(x)
```

You can even let the microservice call itself:

```python
@microservice()
def factorial(x: int) -> int:
    if x <= 1:
        return 1
    return x * factorial(x - 1)
```

### Configurable retry policies

By default, calling microserviced functions will automatically retry if there
is an error, but we can also define our own custom retry policies similar to
the [tenacity Python library](https://tenacity.readthedocs.io/en/latest/):

```python
@microservice(retry=stop_after_attempt(5))
def buggy_function():
    if random.random() < 0.1:
        raise RuntimeError("internal server error")
    return
```

### Configurable scaling policies

By default, each microserviced function will only be run by one instance, but
we can also define our own custom scaling policies:

```python
@microservice(scale=reserve_concurrency(5))
def slow_function():
    time.sleep(60)
    return
```

### Is it even possible to implement said `@microservice` decorator?

Yes it is!

Under the hood, the `@microservice` decorator function can handle the retry
policy during function invocation and scaling policy during the function
definition.

If you aren't familiar with Python decorators, Here is a great
[primer on Python decorators](https://realpython.com/primer-on-python-decorators/).

For simplicity's sake, let's not consider retry and scale policies and run the
individual microservices within the same server API. Here is an example
implementation of what the `@microservice` decorator could look like:

```python
import inspect

import httpx
from fastapi import FastAPI

app = FastAPI()

ENDPOINT = "http://127.0.0.1:8000"
LOCAL_MODE = __name__ == "__main__"


def microservice():
    def decorator(func):
        if LOCAL_MODE:
            return func

        # Add to FastAPI server
        app.get(func.__name__)(func)

        # Make GET request to call server route
        def wrapper(*args, **kwargs):
            return httpx.get(
               f"{ENDPOINT}/{func.__name__}",
               params=inspect.signature(func).bind(*args, **kwargs).arguments
            ).json()

        return wrapper

    return decorator


@microservice()
def fib(n: int) -> int:
    if n <= 1:
        return 1
    return fib(n - 1) + fib(n - 2)


if __name__ == "__main__":
    print(fib(5))
```

If we run directly from commandline we get the result of `fib(5)` which is
computed locally:

```bash
$ python microservice.py
8
```

We could make a curl request to call `fib(5)` through HTTP:

```bash
$ fastapi dev microservice.py
$ curl -X GET http://127.0.0.1:8000/fib?n=5
8
```

This is what the FastAPI logs look like when `fib(5)` is called:

```bash
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [39256] using WatchFiles
INFO:     Started server process [9884]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:61858 - "GET /fib?n=1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61859 - "GET /fib?n=0 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61857 - "GET /fib?n=2 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61860 - "GET /fib?n=1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61856 - "GET /fib?n=3 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61862 - "GET /fib?n=1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61863 - "GET /fib?n=0 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61861 - "GET /fib?n=2 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61855 - "GET /fib?n=4 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61866 - "GET /fib?n=1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61867 - "GET /fib?n=0 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61865 - "GET /fib?n=2 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61868 - "GET /fib?n=1 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61864 - "GET /fib?n=3 HTTP/1.1" 200 OK
INFO:     127.0.0.1:61854 - "GET /fib?n=5 HTTP/1.1" 200 OK
```

We even get automatic documentation of our "microserviced" function:

![FastAPI Docs](/img/microservices/fastapi.png)

### Why bother with this?

I can think of many benefits to this new approach to writing microservice code:

1. You can switch between a monolithic and a microservices architecture with
   ease
2. Reduces the cognitive load and complexity of setting up microservices
3. Microservice code defines the client APIs making it hard to call
   microservices incorrectly
4. Code is far easier to test

If someone has an alternative implementation of the `@microservice` decorator,
I would absolutely love to know more about it, and I'll update this blog post
to include links to the implementation.
