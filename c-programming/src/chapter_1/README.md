# Why (the heck) Am I Learning C?

> _"Excuse me professor, it's not 1975 anymore. Why do I have to take a C programming class in order to graduate?"_
>
> \- You (probably)

I asked this same question to myself when I had to take _CS 3100 - Systems Programming_, which was exclusively taught in C.

I also asked similar questions such as:

- Do companies even use C anymore?
- If C is so complicated, why can't I just use Python or JS?

If you find yourself asking these questions as well, I may just have some answers for you that will hopefully allow you to see why just going through the motions of a C programming class may be doing yourself a disservice.

## The Short Answer

So why do I have to learn this language in order to get my CS degree?

I'll put the answer that I found as a CS student simply:

> C allows us to understand the _how_ when it comes to programming, instead of just the _what_

Chances are, this isn't your first programming class in undergrad, and if it is, I may even consider that a better place to start than how most universities approach teaching programming.

Likely, our undergrad started with a higher-level language like Python or Javascript, because they tend to be lighter introductions to programming concepts.

Learning languages like these are useful, but they tend to answer a lot of _what_ questions, such as:

- _What are `for` loops_?
- _What are variables_?
- _What is inheritence_?

When a student learns a language that is a bit lower-level, such as C, we force ourselves to learn _how_ things work, not just _what_ things work.

When we learn to drive a car, sure we can press the pedals and turn the wheel, but if we don't understand what's going on under the hood, our chances of fixing things, or making the next best car, are slim to none.

We, as engineers in general, but more specifically as software engineers, are called to understand how things work! That includes under the hood, and learning C forces us to do that.

## But C is Old!

Yep, C really is the boomer generation of programming languages.

The problem is, modern languages like Python, or even C++ abstract some core concepts away from us as programmers that C forces us to tackle.

The point isn't that C is that _only_ option to write production-level code, of course it isn't, but as students we should embrace the opportunity to lift the abstractions so we can actually grasp the concepts.

Then, once we understand these things, moving to the more modern languages is a breeze, and gives us natural intuition into what might be going on when our programs break.

## Do Companies Actually Use C Anymore?

Short answer? _Yes!_ But maybe not like they used to.

C still has its uses in production-level code today, but it fills a bit of a different role than what it used it.

Back before the conveniences of the higher-level modern languages that are common today, C was used for pretty much everything. Want a new text editor program? Write it in C. A file versioning software like git? Write it in C!

These days, projects like those would probably be tackled by more modern languages for a few reasons, such as:

- Most modern languages handle memory operations for you, so its harder to have memory-related issues such as memory leaks
- Modern languages have larger built-in functionality sets, such as C++ having robust support for strings, where C does not.
- Most modern languages are not platform dependent, meaning whether we're programming a tool for Windows, Linux, Mac, etc, the code will look the same
- etc.

C still has it's uses, however, but increasingly less as a general purpose programming language like it used to.

C sees use in things like embedded development, where memory space is at an absolute premium, and languages with larger built-in libraries would be too large.

C also offers more direct acces to hardware, in that we can write to specific addresses that an embedded device may need us to write to.

C also sees widespread use in low-level programming tasks where speed is crucial, such as operating system development, router software, firmware, and more.

## Summary

Hopefully this section has given you as a programmer a bit more motivation to learn C.

Now let's get in to the actual tutorials.
