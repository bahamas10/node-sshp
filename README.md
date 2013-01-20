sshp
====

simple, intuitive, no bullshit approach to parallel ssh

Installation
------------

    npm install -g sshp

Why?
---

there are thousands of programs that do this, but none of them do it well. I
wanted something simple, visual, non-assumptive, and cross-platform compatible.

sshp is really simple, it takes a command to run (pass directly to `ssh`), and
a list of hosts with `-f file` or passed in over stdin.  For every line of
output from the remote hosts, the hostname will be prepended and printed out to
the user.  All stderr appears red and is written to stderr on the local
machine, and stdout green to stdout.  The exit code will be printed as soon as
it is avaliable if `-e` is supplied, green for 0, red for != 0, as well as the ms
deltas for all operations so you know how long things took.

Most importantly, you can specify the maximum number of concurrent `ssh`
connections to use with `-m` or `--maxjobs`.

Examples
--------

Picture to come soon, lots of pretty colors used

Parallel ssh into hosts supplied by a file, running `uname -v`

    $ cat hosts.txt
    arbiter.hyrule.com
    datadyne.hyrule.com
    gvoice.hyrule.com
    $ sshp -f hosts.txt uname -v
    [gvoice.hyrule.com] joyent_20120921T180038Z
    [arbiter.hyrule.com] joyent_20120921T180038Z
    [datadyne.hyrule.com] oi_151a6

Usage
-----

    Usage: sshp [-m maxjobs] [-f file] command ...

    parallel ssh with streaming output

    examples
      ssh into a list of hosts passed via stdin and get the output of `uname -v`

        sshp uname -v < hosts

      ssh into a list of hosts passed on the command line, limit max parallel
      connections to 3, and grab the output of ps piped to grep on the remote end

        sshp -m 3 -f my_hosts.txt "ps -ef | grep process"

    options
      -d, --debug       turn on debugging information, defaults to false
      -e, --exit-codes  print the exit code of the remote processes, defaults to false
      -f, --file        a file of hosts separated by newlines, defaults to stdin
      -h, --help        print this message and exit
      -i, --identity    ssh identity file to use, passed directly to ssh
      -l, --login       the username to login as, passed directly to ssh
      -m, --max-jobs    the maximum number of jobs to run concurrently, defaults to 30
      -n, --dry-run     print debug information without actually running any commands
      -N, --no-strict   disable strict host key checking for ssh, defaults to false
      -p, --port        the ssh port, passed directly to ssh
      -q, --quiet       pass -q directly to `ssh`
      -s, --silent      silence all stdout and stderr from remote hosts, defaults to false
      -u, --updates     check for available updates
      -v, --version     print the version number and exit

License
-------

MIT License
