# NChat

Built with the intent of being a very basic, but easy to use chat application. Since it is so easy to spin up servers, you can quickly change urls or ports with a few changes. No database is required and it can be run directly from terminal. (only tested on OSX for now).

This uses [socket.io](http://socket.io/) for connecting and [blessed](https://github.com/chjj/blessed) for the skinning. Notifications are supported on all platforms.

# Screenshot

This is dependent on your theme, so colors may vary.

![nchat](https://raw.github.com/irrationalistic/nchat/master/images/screenshot.png)

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

# How to Use

If you want to start a chat server AND also be able to chat, run `nchat -s -u username` where username is what you want your name to be. Once you are up and running, you can use [whatismyip.com](http://www.whatismyip.com/) to find your public-facing address. The default port is 3333, but can be changed by using the `-p 1337` flag.

If your friend has a chat running already, you can connect to it by using `nchat -u username -a 1.2.3.4:3333` where username is your name and the -a flag is set to the ip and port of your server. If the server is hosted online, you can also use the http url to connect (like `-a http://mysite.com`) as long as fowarding is set up correctly.

If you want to deploy a server online, you can do that as well. If the application detects that there is no visual terminal, it will run in server-only mode. You can activate this by using `npm start` or `nchat -s -f`. The 'f' flag forces server-only just in case. This will start a server that cannot also chat, which is useful for deploying to, say, Heroku. Connecting to a deployed nchat on Heroku would be `nchat -u username -a http://myapp.herokuapp.com`.