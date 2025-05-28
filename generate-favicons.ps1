# This PowerShell script creates a simple T-shaped favicon using an online service
# It downloads temporary favicons that you can later replace with your custom designs

# URLs for a simple blue background with white "T" favicon
# These are placeholder URLs - in a real scenario, you would need to create custom favicon files

# Create a temporary directory
$tempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_ -Force; New-Item -ItemType Directory -Path $_.FullName }

# Functions to create placeholder favicon files
function Create-TextFavicon {
  param(
    [string]$text = "T",
    [string]$backgroundColor = "#0000AA",
    [string]$textColor = "#FFFFFF",
    [string]$outputFile,
    [int]$size = 32
  )
  
  # Create a bitmap
  Add-Type -AssemblyName System.Drawing
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  
  # Background
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($backgroundColor))
  
  # Text
  $font = New-Object System.Drawing.Font("Arial", $size/2, [System.Drawing.FontStyle]::Bold)
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($textColor))
  $textSize = $graphics.MeasureString($text, $font)
  $x = ($size - $textSize.Width) / 2
  $y = ($size - $textSize.Height) / 2
  $graphics.DrawString($text, $font, $brush, $x, $y)
  
  # Save the bitmap
  $bitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
  
  # Clean up
  $graphics.Dispose()
  $bitmap.Dispose()
}

# Create favicon files in different sizes
$publicDir = "c:\Users\HP\Desktop\sleyak\public"

# Create the favicon files
Create-TextFavicon -outputFile "$publicDir\favicon-16x16.png" -size 16
Create-TextFavicon -outputFile "$publicDir\favicon-32x32.png" -size 32
Create-TextFavicon -outputFile "$publicDir\apple-touch-icon.png" -size 180
Create-TextFavicon -outputFile "$publicDir\android-chrome-192x192.png" -size 192
Create-TextFavicon -outputFile "$publicDir\android-chrome-512x512.png" -size 512

# Note: This script creates very basic placeholder favicons.
# For a professional appearance, you should:
# 1. Use a proper design tool like Figma, Adobe Illustrator, or Photoshop
# 2. Create a custom "T" design with 3D effects
# 3. Export in the correct formats and resolutions
# 4. Replace these placeholder files with your custom designs

Write-Host "Basic placeholder favicon files have been created in the public directory."
Write-Host "Please replace them with your custom designed icons when ready."
