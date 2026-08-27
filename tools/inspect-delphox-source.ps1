Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile('C:\Users\Cynao\Downloads\Rejuvenation-14.0-windows\Graphics\Battlers\delphox\1.png')
'Source: {0}x{1}' -f $b.Width, $b.Height
foreach ($p in @(@(0,0), @(223,0), @(224,0), @(0,223), @(0,224), @(224,224))) {
	$c = $b.GetPixel($p[0], $p[1])
	'{0},{1}: A={2} R={3} G={4} B={5}' -f $p[0], $p[1], $c.A, $c.R, $c.G, $c.B
}
$counts = @{}
for ($x = 0; $x -lt $b.Width; $x += 4) {
	for ($y = 0; $y -lt $b.Height; $y += 4) {
		$c = $b.GetPixel($x, $y)
		if ($c.A -eq 0) { continue }
		$key = '{0},{1},{2},{3}' -f $c.A, $c.R, $c.G, $c.B
		$counts[$key] = 1 + ($counts[$key] | ForEach-Object { $_ })
	}
}
$counts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 20 | ForEach-Object { '{0}: {1}' -f $_.Key, $_.Value }
foreach ($p in @(@(300,50), @(100,300), @(300,300), @(430,100), @(50,300), @(250,250))) {
	$c = $b.GetPixel($p[0], $p[1])
	'{0},{1}: A={2} R={3} G={4} B={5}' -f $p[0], $p[1], $c.A, $c.R, $c.G, $c.B
}
$b.Dispose()
