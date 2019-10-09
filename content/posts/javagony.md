+++
title = "Algorithms in Javagony"
date = "2019-10-08"
author = "Daren Liang"
description = "Makes Java even more painful to write."
+++

### The Javagony

First coined by [flawr](https://chat.stackexchange.com/users/122082/flawr), Javagony is Java with a few statements made not available.

Here are the statements that are not available:
```
for (){}
if (){} //including else and else if
while (){}
do {} while ();
switch(){}
?:
```

These statements can be substituted for try catch statements and recursion.

Although Javagony is not the least bit fun to write, it makes you think about clever tricks that utilize many Java's obscure features.

Here is an example of counting to n in Javagony:
```Java
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

Try it yourself, you'll love or hate it!

Here is a GitHub repo that contains some basic concepts implemented in Javagony: https://github.com/darenliang/JavagonyAlgorithms