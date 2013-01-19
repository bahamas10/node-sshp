sshp
====

simple, intuitive, no bullshit approach to parallel ssh

Installation
------------

    npm install -g sshp

Why?
---

there are thousands of programs that do this, but none of them do it well. I wanted
something simple, visual, non-assumptive, and cross-platform compatible.

It's really simple, it takes a command to run (pass directly to `ssh`), and a list
of hosts with `-f file` or passed in over stdin.  For every line of output from the
remote hosts, the hostname will be prepended and printed out to the user.  All stderr
appears red, and stdout green.  The exit code will be printed as soon as it is avaliable,
green for 0, red for != 0.  The deltas will be printed for all operations so you know
how long things took.

Most importantly, you can specify the maximum number of concurrent `ssh` connections to use
with `-P` or `--maxjobs`.

Examples
--------

Picture to come soon, lots of pretty colors used

Parallel ssh into hosts supplied by a file, running `uname -v`

    $ cat hosts.txt
    arbiter.hyrule.com
    datadyne.hyrule.com
    gvoice.hyrule.com
    $ sshp -f hosts.txt uname -v
    [sshp] starting: 2013-01-19T00:57:23.224Z
    [sshp] hosts: [ 'arbiter.hyrule.com', 'datadyne.hyrule.com', 'gvoice.hyrule.com' ]
    [sshp] command: [ 'uname', '-v' ]
    [sshp] maxjobs: 30
    [sshp] [arbiter.hyrule.com] [ 'ssh', 'arbiter.hyrule.com', 'uname', '-v' ]
    [sshp] [datadyne.hyrule.com] [ 'ssh', 'datadyne.hyrule.com', 'uname', '-v' ]
    [sshp] [gvoice.hyrule.com] [ 'ssh', 'gvoice.hyrule.com', 'uname', '-v' ]
    [gvoice.hyrule.com] joyent_20120921T180038Z
    [gvoice.hyrule.com] exited: 0 (263 ms)
    [arbiter.hyrule.com] joyent_20120921T180038Z
    [arbiter.hyrule.com] exited: 0 (275 ms)
    [datadyne.hyrule.com] oi_151a6
    [datadyne.hyrule.com] exited: 0 (303 ms)
    [sshp] finished: 2013-01-19T00:57:23.533Z (309 ms)

The same ssh on the same file, with the `--silent` flag present

    $ sshp -s -f hosts.txt uname -v
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
      -f, --file       a file of hosts separated by newlines
      -h, --help       print this message and exit
      -l, --login      the username to login as, passed directly to ssh
      -m, --maxjobs    the maximum number of jobs to run concurrently
      -n, --no-strict  disable strict host key checking for ssh
      -p, --port       the ssh port, passed directly to ssh
      -q, --quiet      pass -q directly to `ssh`
      -s, --silent     silence all debug information from sshp
      -u, --updates    check for available updates
      -v, --version    print the version number and exit

License
-------

MIT License
