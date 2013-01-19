#!/usr/bin/env node
/**
 * Parallel SSH
 *
 * simple, intuitive, no bullshit parallel ssh
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 1/18/2013
 * License: MIT
 */

var child_process = require('child_process');
var fs = require('fs');
var util = require('util');

var async = require('async');
var getopt = require('posix-getopt');
var latest = require('latest');
var ll = require('lazylines');

var package = require('./package.json');

require('colors');

/**
 * Usage
 *
 * return the usage message
 */
function usage() {
  return [
    'Usage: sshp [-m maxjobs] [-f file] command ...',
    '',
    'parallel ssh with streaming output',
    '',
    'examples',
    '  ssh into a list of hosts passed via stdin and get the output of `uname -v`',
    '',
    '    sshp uname -v < hosts',
    '',
    '  ssh into a list of hosts passed on the command line, limit max parallel',
    '  connections to 3, and grab the output of ps piped to grep on the remote end',
    '',
    '    sshp -m 3 -f my_hosts.txt "ps -ef | grep process"',
    '',
    'options',
    '  -f, --file       a file of hosts separated by newlines',
    '  -h, --help       print this message and exit',
    '  -l, --login      the username to login as, passed directly to ssh',
    '  -m, --maxjobs    the maximum number of jobs to run concurrently',
    '  -n, --no-strict  disable strict host key checking for ssh',
    '  -p, --port       the ssh port, passed directly to ssh',
    '  -q, --quiet      pass -q directly to `ssh`',
    '  -s, --silent     silence all debug information from sshp',
    '  -u, --updates    check for available updates',
    '  -v, --version    print the version number and exit'
  ].join('\n');
}

// verbose log
function vlog() {
  if (silent) return;
  var s = util.format.apply(this, arguments);
  console.log('[%s] %s', 'sshp'.cyan, s);
}

// wrapper for util.inspect for array
function insarray(arr) {
  var items = [];
  arr.forEach(function(item) {
    items.push(util.inspect(item, false, null, true));
  });
  return util.format('[ %s ]', items.join(', '));
}

// command line arguments
var options = 'f:(file)h(help)m:(maxjobs)l:(login)n(no-strict)p:(port)q(quiet)s(silent)u(updates)v(version)';
var parser = new getopt.BasicParser(options, process.argv);

var option;
var file;
var login;
var maxjobs = 30;
var nostrict = false;
var port;
var quiet = false;
var silent = false;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'f': // file
      file = option.optarg;
      break;
    case 'h': // help
      console.log(usage());
      process.exit(0);
      break;
    case 'l': // login
      login = option.optarg;
      break;
    case 'm': // maxjobs
      maxjobs = +option.optarg;
      break;
    case 'n': // no-strict
      nostrict = true;
      break;
    case 'p': // port
      port = +option.optarg;
      break;
    case 'q': // quiet
      quiet = true;
      break;
    case 's': // silent
      silent = true;
      break;
    case 'u': // check for updates
      latest.checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
      break;
    case 'v': // version
      console.log(package.version);
      process.exit(0);
      break;
    default:
      console.error(usage());
      process.exit(1);
      break;
  }
}
var command = process.argv.slice(parser.optind());

// read the hosts
file = file || '/dev/stdin';
var hosts = fs.readFileSync(file).toString().split('\n').filter(function(a) { return a; });

var progstart = new Date();
vlog('starting: %s', progstart.toISOString());
vlog('hosts: %s', insarray(hosts));
vlog('command: %s', insarray(command));
vlog('maxjobs: %s', ('' + maxjobs).green);

// construct the SSH command
var sshcommand = ['ssh'];
if (quiet) sshcommand.push('-q');
if (port) sshcommand.push('-p', port);
if (login) sshcommand.push('-l', login);
if (nostrict) sshcommand.push('-o', 'StrictHostKeyChecking=no');

// make a queue
var q = async.queue(processhost, maxjobs);

// loop the hosts and go!
hosts.forEach(function(host) {
  q.push(host, function() {});
});
q.drain = function() {
  var progend = new Date();
  var delta = progend - progstart;
  vlog('finished: %s (%s ms)', progend.toISOString(), ('' + delta).magenta);
};

// the function the queue should call for each host
function processhost(host, cb) {
  var started = new Date();
  var cmd = sshcommand.concat(host, command);
  var child = child_process.spawn(cmd[0], cmd.slice(1));
  vlog('[%s] %s', host.yellow, insarray(cmd));

  // hook up stdout
  var stdout = new ll.LineReadStream(child.stdout);
  stdout.on('line', function(line) {
    line = ll.chomp(line);
    console.log('[%s] %s', host.cyan, line.green);
  });

  // hook up stderr
  var stderr = new ll.LineReadStream(child.stderr);
  stderr.on('line', function(line) {
    line = ll.chomp(line);
    console.log('[%s] %s', host.cyan, line.red);
  });

  // capture the exit
  child.on('exit', function(code) {
    if (!silent) {
      var delta = new Date() - started;
      console.log('[%s] exited: %s (%s ms)', host.cyan,
          code === 0 ? ('' + code).green : ('' + code).red, ('' + delta).magenta);
    }
    cb();
  });
}
