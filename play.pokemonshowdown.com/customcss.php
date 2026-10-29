<?php

ini_set('max_execution_time', 60); // 1 minute

require_once __DIR__ . '/../config/config.inc.php';
require_once __DIR__ . '/../lib/customcss-fetch.lib.php';
require_once __DIR__ . '/../config/servers.inc.php';

spl_autoload_register(function ($class) {
	require_once(__DIR__ . '/../lib/css-sanitizer/'.str_replace('\\', DIRECTORY_SEPARATOR, $class).'.php');
});

use Wikimedia\CSS\Parser\Parser;

use Wikimedia\CSS\Sanitizer\StylesheetSanitizer;

$server = @$_REQUEST['server'];
if ($server === 'showdown' || $server === 'smogtours') die();
if (empty($PokemonServers[$server])) {
	header('Content-Type: text/plain; charset=utf-8');
	die('server not found');
}

$invalidate = isset($_REQUEST['invalidate']);

if (!$invalidate) header('Content-Type: text/css'); // the CSS file should specify a charset

$serverdata =& $PokemonServers[$server];
$customcssuri = @$serverdata['customcss'];
if (empty($customcssuri)) {
	$protocol = ($serverdata['port'] === 443) ? 'https' : 'http';
	$customcssuri = $protocol . '://'.$serverdata['server'].':'.$serverdata['port'].'/custom.css';
}

// No need to sanitise $server because it should be safe already.
$cssfile = __DIR__ . '/../config/customcss/' . $server . '.css';

$lastmodified = @filemtime($cssfile);
$timenow = time();
$expiration = ($lastmodified ? $lastmodified : $timenow) + 3600;
header('Expires: ' . gmdate('D, d M Y H:i:s T', $expiration));

// echo '/* ', $customcssuri, ' */';

if (!$invalidate && $lastmodified && (($timenow - $lastmodified) < 3600)) {
	// Don't check for modifications more than once an hour.
	readfile($cssfile);
	die();
}

// Coalesce refreshes and rate-limit public forced refreshes across PHP workers.
$lock = fopen($cssfile . '.lock', 'c+');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
	http_response_code(429);
	header('Cache-Control: no-store');
	header('Retry-After: 60');
	die('/* Custom CSS refresh in progress. */');
}
$lastAttempt = (int)stream_get_contents($lock);
if ($lastAttempt && $timenow - $lastAttempt < 60) {
	http_response_code(429);
	header('Cache-Control: no-store');
	header('Retry-After: 60');
	die('/* Please wait before refreshing custom CSS again. */');
}
ftruncate($lock, 0); rewind($lock); fwrite($lock, (string)$timenow); fflush($lock);
$headers = ['User-Agent: PSCustomCSS/0.2 (server=' . $server . ')'];
if ($lastmodified && !$invalidate) $headers[] = 'If-Modified-Since: ' . gmdate('D, d M Y H:i:s T', $lastmodified);
$response = fetchCustomCSS($customcssuri, $headers);
if (!$response['ok'] || !in_array($response['status'], [200, 304], true) || ($response['status'] === 304 && !$lastmodified)) {
	http_response_code(502);
	header('Cache-Control: no-store');
	die('/* Custom CSS could not be refreshed. Try again later. */');
}
if ($response['status'] === 304) {
	touch($cssfile, $timenow);
	if (!$invalidate) readfile($cssfile);
} else {
	$parser = Parser::newFromString($response['body']);
	$stylesheet = $parser->parseStylesheet();
	$sanitizer = StylesheetSanitizer::newDefault();
	$newStylesheet = $sanitizer->sanitize($stylesheet);
	$outputcss = Wikimedia\CSS\Util::stringify($newStylesheet, ['minify' => true]);
	$temp = tempnam(dirname($cssfile), '.css-');
	if ($temp === false || file_put_contents($temp, $outputcss) === false || !rename($temp, $cssfile)) {
		if ($temp !== false && is_file($temp)) unlink($temp);
		http_response_code(503);
		header('Cache-Control: no-store');
		die('/* Custom CSS could not be saved. */');
	}
	if (!$invalidate) echo $outputcss;
}
flock($lock, LOCK_UN); fclose($lock);

if ($invalidate) {
?>
<p>
	Done: <?= htmlspecialchars($customcssuri) ?> was reloaded.
</p>
<p>
	<a href="http://<?= $psconfig['routes']['root'] ?>/servers/<?= $server ?>">Back to server management</a>
</p>
<?php
}
