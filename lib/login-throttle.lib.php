<?php
function currentLoginThrottle($row, $now) {
	if ($row && (int)$row['time'] + 86400 <= $now) return ['count' => 0, 'time' => $now];
	return $row;
}
