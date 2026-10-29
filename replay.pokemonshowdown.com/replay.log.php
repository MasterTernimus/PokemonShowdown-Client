<?php

/**
 * replay.log.php
 *
 * Serves `[replay].log` and `[replay].json` APIs. The latter is used by
 * replay.pokemonshowdown.com and also the sim's built-in replay viewer;
 * the former is purely an external API.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

$manage = false;

require_once 'replays.lib.php';

require_once __DIR__ . '/replay-access.lib.php';

$replay = null;
$id = $_REQUEST['name'] ?? '';
if ($id !== '' && !validReplayName($id)) { http_response_code(404); die(); }
$password = '';

if (substr($id, -2) === 'pw') {
	$dashpos = strrpos($id, '-');
	$password = substr($id, $dashpos + 1, -2);
	$id = substr($id, 0, $dashpos);
	// die($id . ' ' . $password);
}

// $forcecache = isset($_REQUEST['forcecache8723']);
$forcecache = false;
if ($id) {
	if ($cachePath = replayCachePath($id)) {
		include $cachePath;
		$replay['formatid'] = '';
		$replay['log'] = str_replace("\r","",$replay['log']);
		$replay['players'] = [$replay['p1'], $replay['p2']];
		$matchSuccess = preg_match('/\\n\\|tier\\|([^|]*)\\n/', $replay['log'], $matches);
		if ($matchSuccess) $replay['format'] = $matches[1];
		if (@$replay['date']) {
			$replay['uploadtime'] = $replay['date'];
			unset($replay['date']);
		}
	} else {
		require_once 'replays.lib.php';
		if (!$Replays->db && !$forcecache) {
			header('HTTP/1.1 503 Service Unavailable');
			die();
		}
		$replay = $Replays->get($id, $forcecache);
	}
}
if (!$replay || (replayIsDeleted($replay) && !$manage)) {
	header('HTTP/1.1 404 Not Found');
	die();
}
if ($replay['password'] ?? null) {
	if ($password !== $replay['password']) {
		header('HTTP/1.1 404 Not Found');
		die();
	}
}

if (@$replay['inputlog']) {
	if (
		$replay['safe_inputlog'] ||
		$manage
	) {
		// ok
	} else {
		unset($replay['inputlog']);
	}
}
unset($replay['safe_inputlog']);

if (isset($_REQUEST['json'])) {
	$matchSuccess = preg_match('/\\n\\|tier\\|([^|]*)\\n/', $replay['log'], $matches);
	if ($matchSuccess) $replay['format'] = $matches[1];

	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	die(json_encode($replay));
}

if (isset($_REQUEST['inputlog'])) {
	header('Content-Type: text/plain');
	header('Access-Control-Allow-Origin: *');
	die($replay['inputlog'] ?? '');
}

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');
echo $replay['log'];
