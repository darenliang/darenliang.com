---
title: "Algorithms in Javagony"
date: "2019-10-08"
showthedate: true
---

<script async defer src="https://buttons.github.io/buttons.js"></script>

### The Javagony

First coined by [flawr](https://chat.stackexchange.com/users/122082/flawr),
Javagony is Java with a few statements made not available.

Here are the statements that are not available:

```java
for (){}
if (){} else if (){} else {}
while (){}
do {} while ()
switch (){}
?:
```

These statements can be substituted for try catch statements and recursion.

Although Javagony is not the least bit fun to write, it makes you think about
clever tricks that utilize many of Java's obscure features.

Here is an example of counting to n in Javagony:

```java {linenos=table}
public class Loops {
    private static final int[] ints = {1, 0};
    private static int temp;

    private static void countToN(int n) {
        countToN(n, 1);
    }

    private static void countToN(int n, int i) {
        try {
            temp = 1 / ints[((n - i) >> 31) & 1];
        } catch (ArithmeticException e) {
            return;
        }
        try {
            temp = 1 / (n - i);
        } catch (ArithmeticException e) {
            System.out.println(n);
            return;
        }
        System.out.println(i);
        countToN(n, i + 1);
    }

    public static void main(String[] args) {
        countToN(10);
    }
}
```

Please note that there are multiple and equally creative ways to implement algorithms! The sky's the limit!

The above example isn't easily digestible, so I've created a GitHub repo that implements a handful of examples and goes through the process of implementing conditionals.

Try it yourself, you'll love or hate it!

<a class="github-button" href="https://github.com/darenliang/JavagonyAlgorithms" data-size="large" aria-label="Visit JavagonyAlgorithms on GitHub">
Visit JavagonyAlgorithms on GitHub</a>
