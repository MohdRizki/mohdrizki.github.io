Add-Type -AssemblyName System.Drawing

$imagePath = "d:\BERKAS SDN PASIRMAE 1\FAIL GURU\MOHAMAD RIZKI\OTHERS\PROJECTS\PORTOFOLIO\public\pointer.png"
$tempPath = "d:\BERKAS SDN PASIRMAE 1\FAIL GURU\MOHAMAD RIZKI\OTHERS\PROJECTS\PORTOFOLIO\public\pointer_temp.png"

$img = [System.Drawing.Image]::FromFile($imagePath)
$newWidth = [int][math]::Round($img.Width * 0.8)
$newHeight = [int][math]::Round($img.Height * 0.8)

$newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$graph = [System.Drawing.Graphics]::FromImage($newImg)

$graph.Clear([System.Drawing.Color]::Transparent)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

$img.Dispose()
$newImg.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newImg.Dispose()
$graph.Dispose()

Move-Item -Path $tempPath -Destination $imagePath -Force
Write-Host "Resized to ${newWidth}x${newHeight}"
