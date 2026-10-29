<?php
// Shared by both public readers; pretty-URL rewrite rules do not protect direct requests.
function validReplayName($name) {
	return is_string($name) && strlen($name) <= 256 && preg_match('/\A[a-zA-Z0-9-]+\z/', $name);
}
function replayCachePath($id, $directory = null) {
	if (!validReplayName($id)) return false;
	$root = realpath($directory ?? __DIR__ . '/caches');
	if ($root === false) return false;
	$file = realpath($root . DIRECTORY_SEPARATOR . $id . '.inc.php');
	if ($file === false || dirname($file) !== $root) return false;
	return $file;
}
function replayIsDeleted($replay) {
	return is_array($replay) && (int)($replay['private'] ?? 0) === 3;
}
