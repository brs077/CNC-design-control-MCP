# Night-Sky Photo Workflow: Stacking, Star Removal & Meteor Hunting

*A practical guide based on a few months of real sessions (Aug–Oct 2026), using an AI coding assistant (Claude Code) to do the heavy lifting. It was done on a Mac, but everything here works on Windows too.*

**What this guide covers:**
1. **Stacking telescope photos.** Hundreds or thousands of short shots are combined into one clean, colorful image of a nebula.
2. **Removing the stars.** This lets the nebula pop, and you can add the stars back at lower strength.
3. **Finding meteors.** A program goes through a whole night of camera frames and picks out the ones with a meteor in them, not a plane or satellite.
4. **Making timelapses and star trails** that play smoothly on phones and laptops.

You don't need to be a programmer. The AI writes and runs the scripts; your job is to say what you want and tell it when the results look wrong.

---

## Quick glossary

| Term | What it means |
|---|---|
| **Sub / sub-frame** | One single exposure. A finished image is made from many subs. |
| **Stacking** | Lining up and averaging many subs. Noise cancels out and faint detail builds up. |
| **Stretching** | Raw stacked images look almost black. Stretching brightens the faint stuff without blowing out the stars. Think of it as an extreme curves adjustment. |
| **Starless image** | The same photo with the stars digitally removed, so only the nebula is left. |
| **Plate solving** | The software works out exactly where in the sky the photo points by matching its star pattern. |
| **Color calibration (SPCC)** | Uses star catalog data to set "true" colors, like a scientifically accurate white balance. |
| **Bayer pattern** | The layout of red, green and blue pixels on the sensor (RGGB, GBRG, etc.). If the software guesses it wrong, the colors come out wrong. |
| **Raw files (NEF / DNG)** | Nikon's raw format (NEF) and Adobe's universal raw format (DNG). |
| **Timelapse** | Thousands of frames played back as a video. |
| **Bitrate / CRF** | How much data per second a video uses. Higher means bigger files that are harder for devices to play. |

---

## What you'll need (Mac & Windows)

Install these once. Everything here is free.

| App | What it's for | Mac | Windows |
|---|---|---|---|
| **Claude Code** | The AI assistant that writes and runs the scripts | Install the **Claude desktop app** from [claude.ai/download](https://claude.ai/download) | Same |
| **Siril** | Stacking, color calibration, stretching | Download from [siril.org](https://siril.org/download/) | Download from [siril.org](https://siril.org/download/) |
| **StarNet2** | Star removal | Download the Mac version from [starnetastro.com](https://www.starnetastro.com/) and unzip it into your home folder | Download the Windows version from [starnetastro.com](https://www.starnetastro.com/) and unzip it to `C:\StarNet2` |
| **Python 3.12** | Runs the meteor-finding scripts | See the Homebrew note below, then run `brew install python@3.12` | Download from [python.org](https://www.python.org/downloads/) and **tick "Add Python to PATH"** during install |
| **ExifTool** | Reads the capture time from each photo | `brew install exiftool` | Download from [exiftool.org](https://exiftool.org/) |
| **FFmpeg** | Turns frames into videos | `brew install ffmpeg` | Download from [ffmpeg.org](https://ffmpeg.org/download.html) (the "gyan.dev" builds are easiest) |
| **Adobe DNG Converter** *(optional)* | Converts raws for apps that can't read them | [Adobe download](https://helpx.adobe.com/camera-raw/using/adobe-dng-converter.html) | Same |

**Mac users: what's `brew`?** Homebrew is a free tool for installing apps from the Terminal. Install it once from [brew.sh](https://brew.sh) by copying its one-line command into Terminal. After that, every `brew install …` line above just works.

**Windows users: shortcut.** If you're comfortable with the command line, `winget install Python.Python.3.12`, `winget install OliverBetz.ExifTool` and `winget install Gyan.FFmpeg` install three of these in one go.

**Easy mode:** you can also just ask Claude, *"Install Python 3.12, ExifTool, and FFmpeg for me and set up a folder for the meteor scripts."* It will run the commands and install the Python add-ons (numpy, OpenCV, etc.) itself.

**Connect StarNet2 to Siril:** in Siril, open **Preferences → Miscellaneous**, find **StarNet executable**, and point it at the `starnet2` file (`starnet2.exe` on Windows) in the folder you unzipped.

**Storage:** a single night of shooting on a high-res camera can be **50–100 GB**. Have at least twice that free before you start.

---

## Part 1: Stacking telescope photos (Siril + StarNet2)

**What we did:** took data from a Unistellar Odyssey smart telescope of the Eastern Veil Nebula (733 subs) and the Crescent Nebula (4,605 subs). We processed it ourselves and got noticeably better color and detail than the telescope's own app.

### The steps
1. **Stack** all the subs in Siril.
2. **Plate solve**, then run **color calibration (SPCC)** for accurate color.
3. **Remove the background gradient.** This takes out the uneven glow from light pollution or the moon.
4. **Denoise at half strength.** Full strength makes things look smudgy.
5. **Stretch** to bring out the faint nebula. Use the *linked* option (see tips).
6. **Add saturation.**
7. **Remove the stars with StarNet2.** You get two layers: nebula only, and stars only.
8. **Blend the stars back in at about 30%.** The nebula becomes the hero and the stars stay subtle.

**What you end up with for each target:** a final image, a stars-at-30% version, a starless version, and a stars-only layer, saved as PNG (for sharing) and 16-bit TIFF (for editing). Keep the `.fit` file too; it's your untouched master.

### Things that tripped us up
- **Weird colors?** The Unistellar files claim the color layout is **RGGB**, but it's really **GBRG**. Set it manually in Siril or everything comes out tinted.
- **Always use a "linked" stretch.** An unlinked stretch brightens each color channel separately, which throws the color balance off again.
- **Starless image looks hazy or smoky?** Too much denoise plus saturation causes that. Use half-strength denoise and run background removal again on the starless image. That cleared it up and kept more fine detail in the nebula.
- **Prefer more control?** Siril's **GHS** stretch tool is the advanced way to stretch: it gives you more control over the bright areas than auto-stretch.
- **Blurry target?** It's usually not your processing. Low targets near the horizon look softer because you're shooting through more atmosphere.
- **Quick tracking check:** play your subs back in order as a mini timelapse. If the image wanders, your tracking or pointing was off.
- **Harmless warnings:** Siril may show a "no suitable data" error on denoise, and Python crash warnings on Mac. You can ignore both.

---

## Part 2: Finding meteors in a night of photos

**What we did:** shot all night on a **Nikon Z8**, which gives thousands of frames. A script found the few frames with a real meteor and threw out planes, satellites, clouds and trees.

### How the script decides
1. **Sort the frames by capture time.** It also removes duplicate and empty files that sometimes show up on memory cards.
2. **Use the preview JPEG built into each raw file.** It's fast: a whole night took about 11 seconds.
3. **Compare each frame with the ones next to it** to find new streaks of light.
4. **Ignore the foreground** (trees, horizon) using a mask.
5. **Check how thin each streak is.** Meteors are razor thin, about 1–2 pixels; cloud edges are fat, about 24 pixels. This turned out to be the best single test.
6. **Weed out planes and satellites:**
   - **Planes** have blinking lights, so their trail looks dashed and often has red in it.
   - **Satellites** show up in several frames in a row along the same line.
   - **Meteors** are a single smooth streak in a single frame.
7. **Skip twilight frames** at dusk and dawn.
8. **Make contact sheets** (grids of thumbnails) and a spreadsheet of candidates, so you can check them by eye quickly.
9. **Make circled copies** of the meteor frames, so the streak is easy to spot when you share them.

### Things that tripped us up
- **Nikon "High Efficiency" raw files** can't be opened by a lot of free software. The built-in preview JPEG works great for detection.
- **Converting to DNG isn't worth it** for these files. The DNGs came out 42% *bigger* and lost Nikon's Picture Control settings. Keep the original NEFs.
- **The script will miss some meteors.** Once the plane filters were strict, the "definitely a meteor" pile shrank from 389 to 7 on one night. Always ask for an **"all streaks" folder** too and look through it yourself.
- **Damaged files happen.** A few frames on the card were corrupted. Make sure the script skips bad files instead of crashing.
- **Green sky?** That's probably **airglow**, a natural glow in the upper atmosphere. It's not your lens, and it's not aurora unless the space-weather (Kp) index is high.

---

## Part 3: Timelapses & star trails

**What we made:**
- A 4K timelapse of the whole night at 24 fps, in an edited version and a natural version.
- Star-trail videos where the trails build up over time, plus a "comet-tail" version where the trails fade behind the stars.
- A single star-trail photo combining the whole night.
- A **stars-only** star-trail video where planes and satellites fade out instead of cluttering the trails.

### Why our first videos stuttered and froze (and the fix)
There were two problems:

1. **The files were way too heavy.** Sensor grain makes video files huge: ours were 178–403 Mbps, more than devices could keep up with. A light noise reduction and slightly more compression brought them down to 10–61 Mbps with no visible difference.
2. **The wrong video format for the resolution.** At this resolution, the common H.264 format won't play on Macs, iPhones or iPads. Switching to **HEVC (H.265)** fixed it.

Here's the FFmpeg command that worked. You can also just ask Claude to "make a 4K HEVC timelapse from this folder":

```bash
ffmpeg -framerate 24 -i frames/%05d.jpg \
  -vf "hqdn3d=3:3:0:0" \
  -c:v libx265 -crf 20 -preset slow -tag:v hvc1 -pix_fmt yuv420p \
  timelapse_4k.mp4
```

- `hqdn3d=3:3:0:0` is a light noise reduction that works **within** each frame only. Don't use noise reduction that blends frames together, because it erases meteors (they only appear in one frame).
- `-crf 20` sets the quality. Lower numbers mean higher quality and bigger files.
- `-tag:v hvc1` makes the video play on Apple devices.
- **Windows:** to play HEVC in the built-in Photos/Movies apps, install **HEVC Video Extensions** from the Microsoft Store, or just use **VLC** (free).

**Bonus tip:** a star-trail video is also a great way to check whether your tracking mount actually tracked.

---

## Tips for working with an AI assistant on this

- **Write down what you want first.** A short notes file ("find meteors, ignore planes, give me contact sheets") keeps things on track across sessions.
- **Ask for things you can look at:** contact sheets, before/after pairs, a spreadsheet of results. That's much faster than opening files one by one.
- **Push back when something looks off.** "You're missing meteors," "this looks hazy" and "the video stutters" each led to one of the fixes above.
- **Ask it to explain.** If a step or setting doesn't make sense, ask "why?" It's a good way to learn the processing as you go.
- **Want to look at results on your phone?** Ask for a simple web page with before/after toggles.
