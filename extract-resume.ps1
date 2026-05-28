$bytes = [System.IO.File]::ReadAllBytes('Resume202605050213.pdf')
$text = [System.Text.Encoding]::ASCII.GetString($bytes)
$start = 0
while (($idx = $text.IndexOf('stream', $start)) -ge 0) {
  $end = $text.IndexOf('endstream', $idx)
  if ($end -lt 0) { break }
  $streamStart = $idx + 6
  while ($bytes[$streamStart] -eq 0x0D -or $bytes[$streamStart] -eq 0x0A) { $streamStart++ }
  $streamEnd = $end
  while ($streamEnd -gt $streamStart -and ($bytes[$streamEnd - 1] -eq 0x0D -or $bytes[$streamEnd - 1] -eq 0x0A)) { $streamEnd-- }
  $len = $streamEnd - $streamStart
  $ms = [System.IO.MemoryStream]::new($bytes, $streamStart, $len)
  try {
    $def = [System.IO.Compression.DeflateStream]::new($ms, [System.IO.Compression.CompressionMode]::Decompress)
    $reader = [System.IO.StreamReader]::new($def)
    $decoded = $reader.ReadToEnd()
    if ($decoded -match '\w') {
      Write-Output '--- STREAM ---'
      Write-Output $decoded.Substring(0, [Math]::Min(4000, $decoded.Length))
    }
  } catch {}
  $start = $end + 9
}
