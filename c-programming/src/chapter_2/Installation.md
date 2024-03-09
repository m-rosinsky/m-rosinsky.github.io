# 2.1 - Installation

## Compilers

The first step in any journey to using C is to actually install it.

C is a _compiled_ language, thus, we need to install a compiler for C.

> 📕 _Vocab_
>
> __Compiler__: A specialized program to translate code from one form to another.

Obviously, our computer can't actually read the programs we type out in C. Our CPU can only understand its _instruction set_, which takes the form of 1's and 0's.

Since it would surely be a pain to type an entire file of binary digits and load it into the processor, we use a compiler to translate human readable source code into what's called _machine code_.

> 📕 _Vocab_
>
> __Machine Code__: A program that a CPU can directly execute

A compiler does not necessarily have to translate its programs to machine code. Oftentimes, compilers will translate programs to an _intermediate language_, that can be understood by other programs.

A C compiler, however, _does_ translate source code directly into machine code.

So let's look at how we can install one!

## Which Compiler Should I Install?

There are many options for C compilers that exist today. The most popular ones include:

- `gcc` - The GNU Compiler Collection
- `clang`
- `Borland Turbo C`
- and many more...

Chances are, if you are taking a university class, the professor probably has instructions on their course page for installating a specific compiler that they will be using throughout the class. If so, I would follow that instead of my instructions.

## Linux Installation

Installing a C compiler on Linux is probably the easiest of all the platforms due to Linux's package managers.

For systems such as ubuntu, we'll install `gcc` through the `apt` package manager:

Copy this line into a terminal window.

```bash
$ sudo apt-get update && sudo apt-get install gcc
```

After allowing it to install, we can verify its installation by writing:

```bash
$ which gcc
/usr/bin/gcc
```

The line doesn't have to match the output that I show, but as long as something populates, we know it's installed! If nothing came up after running that command, you should re-check the installation.

We can also check the version by running:

```bash
$ gcc --version
gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
```

## MacOS Installation

We'll use the macOS package manager, _homebrew_, to install our C compiler.

To check if you have homebrew installed, open a terminal session and run:

```bash
$ which brew
```

If nothing comes up, then follow the instructions from brew's [homepage](https://brew.sh/) to install it.

Once that's installed, let's use it to download `gcc`:

```bash
$ brew install gcc
```

Now we should be able to check the version:

```bash
$ gcc --version
```

## Windows Installation

We'll install `gcc` for windows using the runtime environment called `MinGW-w64`.

1. Download `MinGW` from this [page](https://sourceforge.net/projects/mingw-w64/).
2. Run the installer and select the components. At minimum, you'll need the `gcc` compiler.
3. Add `MinGW` to _PATH_. This allows us to run `gcc` from any location in command prompt.
    
Search for `environment` in the search bar and click `Edit the system environment variables`

| ![alt text](../../../assets/environ.png "heel click!") |
|:--:|

Click `Environment Variables`

| ![alt text](../../../assets/environ_2.png "heel click!") |
|:--:| 

Highlight the `Path` entry, and click `Edit`

| ![alt text](../../../assets/environ_3.png "heel click!") |
|:--:|

Select `New`

| ![alt text](../../../assets/environ_4.png "heel click!") |
|:--:|

Enter the installation location for your `MingGW\bin` directory. For example:

| ![alt text](../../../assets/environ_5.png "heel click!") |
|:--:|

Press `OK` until all menus close.

To verify we've successfully installed `gcc`, open command prompt or powershell and type:

```
> gcc --version
```

## Online Compilers

There are also a number of websites that allow you to write and execute code directly in a browser window.

This alleviates the need to install packages on your computer.

Some common sites include:

- [OnlineGDB](https://www.onlinegdb.com/)
- [Programiz](https://www.programiz.com/c-programming/online-compiler/)
- [tutorialspoint](https://www.tutorialspoint.com/compile_c_online.php)
- and many more

If you'd like to use these options throughout these tutorials, that's totally fine!

Personally, I think it's good practice to get used to working with the compiler and command-line tools, since it's essential in any software engineering job.

But for a quick-and-dirty environment to just try out some code snippets without the overhead of the command-line, it's a great solution!
