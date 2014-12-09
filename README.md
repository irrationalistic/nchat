# NChat

Built with the intent of being a very basic, but easy to use chat application. Since it is so easy to spin up servers, you can quickly change urls or ports with a few changes. No database is required and it can be run directly from terminal. (only tested on OSX for now).

This uses [socket.io](http://socket.io/) for connecting and [blessed](https://github.com/chjj/blessed) for the skinning.

# Flags

* **-s, --server:** Run as server
* **-p, --port [port]:** Which port to use?
* **-a, --address [address]:** Which address to use?
* **-u, --user [name]:** Which name to use?
* **-f, --force:** Force to be server with no display

# In-Chat Commands:

* /help - view list of options
* /name newName - change name
* /color hex - change color (don't need the #)
* /users - get list of connected users