<?php
function fetchCustomCSS($url, $headers, $limit = 1048576) {
	$body = '';
	$curl = curl_init($url);
	curl_setopt_array($curl, [
		CURLOPT_HTTPHEADER => $headers,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_MAXREDIRS => 5,
		CURLOPT_CONNECTTIMEOUT => 3,
		CURLOPT_TIMEOUT => 10,
		CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
		CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
		CURLOPT_WRITEFUNCTION => function ($handle, $chunk) use (&$body, $limit) {
			if (strlen($body) + strlen($chunk) > $limit) return 0;
			$body .= $chunk;
			return strlen($chunk);
		},
	]);
	$ok = curl_exec($curl);
	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	curl_close($curl);
	return ['ok' => $ok !== false, 'status' => $status, 'body' => $body];
}
