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

    $ cat hosts.txt
    host1.example.com
    host2.example.com
    host3.example.com
    $ sshp -f hosts.txt uname -v
    [sshp] starting: 2013-01-18T22:49:29.622Z
    [sshp] hosts: [ 'host1.example.com', 'host2.example.com', 'host3.example.com' ]
    [sshp] command: [ 'uname', '-v' ]
    [sshp] maxjobs: 30
    [sshp] [host1.example.com] [ 'ssh', 'host1.example.com', 'uname', '-v' ]
    [sshp] [host2.example.com] [ 'ssh', 'host2.example.com', 'uname', '-v' ]
    [sshp] [host3.example.com] [ 'ssh', 'host3.example.com', 'uname', '-v' ]
    [host1.example.com] SunOS host1 5.11 joyent_20120126T071347Z i86pc i386 i86pc Solaris
    [host2.example.com] SunOS host2 5.11 joyent_20120126T071347Z i86pc i386 i86pc Solaris
    [host3.example.com] SunOS host3 5.11 joyent_20120126T071347Z i86pc i386 i86pc Solaris
    [host1.example.com] exited: 0 (633 ms)
    [host3.example.com] exited: 0 (673 ms)
    [host2.example.com] exited: 0 (646 ms)
    [sshp] finished: 2013-01-18T22:49:30.257Z (702 ms)

Usage
-----

    Usage: sshp [-P maxjobs] [-f file] command ...

    parallel ssh with streaming output

    examples
      ssh into a list of hosts passed via stdin and get the output of `uname -v`

        sshp uname -v < hosts

      ssh into a list of hosts passed on the command line, limit max parallel
      connections to 3, and grab the output of ps piped to grep on the remote end

        sshp -P 3 -f my_hosts.txt "ps -ef | grep process"

    options
      -f, --file       a file of hosts separated by newlines
      -h, --help       print this message and exit
      -l, --login      the username to login as, passed directly to ssh
      -p, --port       the ssh port, passed directly to ssh
      -P, --maxjobs    the maximum number of jobs to run concurrently
      -q, --quiet      if present, a `-q` will be passed to the ssh command
      -u, --updates    check for available updates
      -v, --version    print the version number and exit

License
-------

MIT License
