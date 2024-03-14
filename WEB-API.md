Pokémon Showdown website APIs
=============================

Most PS APIs that you would want to access programmatically are available by adding `.json` to the URL.

They all have `Access-Control-Allow-Origin: *`, so you can access them directly using AJAX.


Replays
-------

Getting a replay:

https://replay.pokemonshowdown.com/gen8doublesubers-1097585496.json

https://replay.pokemonshowdown.com/gen8doublesubers-1097585496.log

Getting a replay inputlog directly (only for formats where the team is autogenerated):

https://replay.pokemonshowdown.com/gen8randombattle-2005209836.inputlog

Replay logs and inputlogs are also available in the JSON, so the `.log` and `.inputlog` forms are provided only for convenience.

Also for convenience: scrolling down in the source code for the replay page. Obviously don't _scrape_ it, but `ctrl`+`u` is way faster than futzing with URLs if you just wanted to take a look at it.


Replay search
-------------

List recent replays:

https://replay.pokemonshowdown.com/search.json

Search by user:

https://replay.pokemonshowdown.com/search.json?user=zarel

Search by multiple users:

https://replay.pokemonshowdown.com/search.json?user=zarel&user2=yuyuko

Search by format:

https://replay.pokemonshowdown.com/search.json?format=gen8ou

Combined searching:

https://replay.pokemonshowdown.com/search.json?user=zarel&user2=yuyuko&format=gen7randombattle

Paginate searches:

https://replay.pokemonshowdown.com/search.json?user=zarel&before=1372221987

Searches are limited to 51 results, and pages are offset by 50 each, so the existence of a 51st result means that there's at least one more page available. For the timestamp, use the uploadtime of the last replay in the list.

You can also use `page=[number]`, but this is an older API that is poorly supported and should not be relied upon.


Users (including ladder information)
------------------------------------

https://pokemonshowdown.com/users/zarel.json


Ladders
-------

https://pokemonshowdown.com/ladder/gen8ou.json


News
----

https://pokemonshowdown.com/news.json

https://pokemonshowdown.com/news/270.json


Dex resources
-------------

https://play.pokemonshowdown.com/data/pokedex.json

https://play.pokemonshowdown.com/data/moves.json