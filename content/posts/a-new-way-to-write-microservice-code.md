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

# {"result": false}
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

Theoretically, yes.

Under the hood, the `@microservice` decorator function can handle the retry
policy during function invocation and scaling policy during the function
definition.

If you aren't familiar with Python decorators, Here is a great
[primer on Python decorators](https://realpython.com/primer-on-python-decorators/).

```python
SETUP_MICROSERVICES = True  # False if you want to only call the microservices

def microservice(retry=None, scale=None):
    def decorator(func):
        if SETUP_MICROSERVICES:
            setup_microservice(func, scale=scale)

        def wrapper(*args, **kwargs):
            return call_microservice(func, args=args, kwargs=kwargs, retry=retry)
        
        return wrapper
    
    return decorator
```

### Why bother with this?

I can think of many benefits to this new approach to writing microservice code:

1. You can switch between a monolithic and a microservices architecture with
   ease
2. Reduces the cognitive load and complexity of setting up microservices
3. Microservice code defines the client APIs making it hard to call
   microservices incorrectly
4. Code is far easier to test

If someone has an implementation of the `@microservice` decorator, I would
absolutely love to know more about it, and I'll update this blog post to
include links to the implementation.
