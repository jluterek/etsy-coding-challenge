## Etsy Coding Challenge


> Please write an application that when given a list of Etsy Shop IDs as a parameter does the following:

> * Synchronizes the shop's listings to several files (one per shop ID), outputting what has been added or removed since the last run.

> Guidelines:
> ----
> * All work is done in a git repository
> * A readme with instructions on how to run the application
> * Use any language you want, with any libraries you want
> * Take as long as you'd like to finish this exercise
> * If you have time, or want to show off, include tests!


## Instructions

1. Download or clone this repository.
2. Run "npm install"
3. Run program from the command line "node index.js"

## Options

```

  Usage: node index.js [options]

  Application to track etsy store listing changes


  Options:

    -V, --version      output the version number
    -k, --apikey       Etsy API Key
    -i, --ids <items>  Comma Separated Store IDs
    -s, --save         Update listings in database
    -h, --help         output usage information

Examples:

  $ node index.js --help
  $ node index.js -h

```

## Example Execution

To execute the program
```
node index.js -k xxxxxxxxxxxxxxxxxxxxxxxx -i 17048633,17048647,17048693,17048703,17048745 --save

Shop ID 17048693
 # modified listing 591892355
    # modified price - 24.99 => 21.99


Shop ID 17048703
No Changes since last sync


Shop ID 17048745
No Changes since last sync


Shop ID 17048647
 - removed listing 578384448


Shop ID 17048633
 - removed listing 591891271
 # modified listing 591890547
    # modified price - 14.99 => 9.99
    # modified quantity - 9 => 1

 # modified listing 578082938
    # modified views - 1 => 3


```