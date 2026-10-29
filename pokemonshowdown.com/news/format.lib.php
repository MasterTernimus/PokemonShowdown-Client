<?php
// Trusted administrator-authored news; use identical markup on create and edit.
function formatNewsText($text) {
	$text = str_replace("\r", '', $text);
	$text = str_replace("\n\n", '</p><p>', $text);
	$text = str_replace("\n", '<br />', $text);
	$text = preg_replace('/\[url="([^\]]+)"\]/', '<a href="$1" target="_blank">', $text);
	$text = preg_replace('/\[url=([^\]]+)\]/', '<a href="$1" target="_blank">', $text);
	$text = str_replace(['[/url]', '[b]', '[/b]', '[i]', '[/i]'], ['</a>', '<strong>', '</strong>', '<em>', '</em>'], $text);
	return '<p>' . $text . '</p>';
}
