Web Service primary URL:
https://onlinegameappwebservice-ymmd.onrender.com

Retrieve all games:
https://onlinegameappwebservice-ymmd.onrender.com/allgames

Add games:
https://onlinegameappwebservice-ymmd.onrender.com/addgame

{
"gamename": "Wuthering Waves",
"gamepic": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/wm/2025/01/wuthering-waves-2-0-visual.jpg"
}

Delete games using GET:
https://onlinegameappwebservice-1.onrender.com/deletegame/3

Delete games using POST:
https://onlinegameappwebservice-1.onrender.com/deletegame

{
"id": 3
}

If add /deletegame/:id at the end, it uses GET.
If add only /deletegame, user will be redirected to the delete page and can type the id and click delete button. This is using POST