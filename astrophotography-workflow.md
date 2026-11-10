# Night-Sky Photo Workflow: Stacking, Star Removal & Meteor Hunting

*A practical guide to processing astrophotos with free tools and an AI assistant (Claude Code) doing the heavy lifting. Works on Mac and Windows.*

**What this guide covers:**
1. **Stacking deep-sky photos.** Combine many short shots into one clean, colorful image, including data from **Unistellar** smart telescopes.
2. **Removing the stars.** This makes the nebula or galaxy stand out; you can add the stars back at lower strength.
3. **Finding meteors.** Go through a whole night of camera frames automatically and keep only the frames with a meteor, not a plane or satellite.
4. **Timelapses and star trails** that play smoothly on phones and laptops.

You don't need to be a programmer. The AI can write and run the scripts. Your job is to say what you want and tell it when the results look wrong.

---

## Quick glossary

| Term | What it means |
|---|---|
| **Sub / sub-frame** | One single exposure. A finished image is made from many subs. |
| **Stacking** | Lining up and averaging many subs. Noise cancels out and faint detail builds up. |
| **Registration** | The "lining up" step before stacking: shifting and rotating each sub so the stars overlap. |
| **Stretching** | Stacked images look almost black. Stretching brightens the faint stuff without blowing out the stars. Think of it as an extreme curves adjustment. |
| **Starless image** | The same photo with the stars digitally removed, so only the nebula or galaxy is left. |
| **Plate solving** | The software works out exactly where in the sky the photo points by matching its star pattern. |
| **Color calibration (SPCC)** | Uses star catalog data to set "true" colors, like a scientifically accurate white balance. |
| **Bayer pattern** | The layout of red, green and blue pixels on a color sensor (RGGB, GBRG, etc.). If the software uses the wrong one, the colors come out wrong. |
| **FITS** | The standard file format for astronomy images. Telescope cameras and smart telescopes save in this format. |
| **Raw files (NEF, CR3, ARW, DNG)** | Camera raw formats. DNG is Adobe's universal raw format. |
| **Field rotation** | On mounts that move up/down and left/right (like most smart telescopes), the sky slowly rotates in the frame during a session. |
| **Bitrate / CRF** | How much data per second a video uses. Higher means bigger files that are harder for devices to play. |

---

## What you'll need (Mac & Windows)

Everything here is free.

| App | What it's for | Mac | Windows |
|---|---|---|---|
| **Claude Code** | AI assistant that writes and runs the scripts | Install the **Claude desktop app** from [claude.ai/download](https://claude.ai/download) | Same |
| **Siril** | Stacking, color calibration, stretching | Download from [siril.org](https://siril.org/download/) | Download from [siril.org](https://siril.org/download/) |
| **StarNet2** | Star removal | Download the Mac version from [starnetastro.com](https://www.starnetastro.com/) and unzip it into your home folder | Download the Windows version from [starnetastro.com](https://www.starnetastro.com/) and unzip it to `C:\StarNet2` |
| **Python 3.12** | Runs the meteor-finding scripts | See the Homebrew note below, then run `brew install python@3.12` | Download from [python.org](https://www.python.org/downloads/) and **tick "Add Python to PATH"** during install |
| **ExifTool** | Reads the capture time from each photo | `brew install exiftool` | Download from [exiftool.org](https://exiftool.org/) |
| **FFmpeg** | Turns frames into videos | `brew install ffmpeg` | Download from [ffmpeg.org](https://ffmpeg.org/download.html) (the "gyan.dev" builds are easiest) |
| **Adobe DNG Converter** *(optional)* | Converts raws for apps that can't read them | [Adobe download](https://helpx.adobe.com/camera-raw/using/adobe-dng-converter.html) | Same |

**Mac users: what's `brew`?** Homebrew is a free tool for installing apps from the Terminal. Install it once from [brew.sh](https://brew.sh) by copying its one-line command into Terminal. After that, every `brew install …` line above just works.

**Windows users: shortcut.** If you're comfortable with the command line, `winget install Python.Python.3.12`, `winget install OliverBetz.ExifTool` and `winget install Gyan.FFmpeg` install three of these in one go.

**Easy mode:** you can also just ask Claude, *"Install Python 3.12, ExifTool and FFmpeg for me and set up a folder for a meteor-finding script."* It will run the commands and install the Python add-ons (numpy, OpenCV, etc.) itself.

**Connect StarNet2 to Siril:** in Siril, open **Preferences → Miscellaneous**, find **StarNet executable**, and point it at the `starnet2` file (`starnet2.exe` on Windows) in the folder you unzipped.

**Storage:** a night of shooting on a high-res camera can be **50–100 GB**, and processing makes temporary copies. Have at least twice that free before you start.

---

## Part 1: Stacking deep-sky photos (Siril + StarNet2)

This works for any camera or telescope: DSLR/mirrorless on a tracker, a dedicated astro camera, or a smart telescope.

### The basic steps
1. **Load your subs** into Siril and convert them to a sequence.
2. **Register** them so the stars line up.
3. **Stack** with outlier rejection. This automatically removes satellite trails, plane trails and hot pixels that show up in only a few subs.
4. **Crop** the ragged edges left over from alignment.
5. **Plate solve**, then run **color calibration (SPCC)** for accurate color.
6. **Remove the background gradient.** This takes out the uneven glow from light pollution or the moon.
7. **Denoise gently.** Half strength is a good start; full strength looks smudgy.
8. **Stretch** to bring out the faint detail. Use the *linked* option (see tips below).
9. **Add saturation** to taste.
10. **Remove the stars with StarNet2.** You get two layers: starless, and stars only.
11. **Blend the stars back in** at around 30–50%. The target becomes the hero and the stars stay subtle.

**Save:** a PNG or JPEG for sharing, a **16-bit TIFF** for editing in Photoshop or Lightroom, and the stacked **`.fit`** file as your untouched master.

### Tips and common problems
- **Always use a "linked" stretch.** An unlinked stretch brightens each color channel separately, which throws the color balance off.
- **Hazy or smoky starless image?** It's usually too much denoise plus saturation. Denoise less, and run background removal again *on the starless image*.
- **Want more control than auto-stretch?** Try Siril's **GHS** (Generalized Hyperbolic Stretch) tool.
- **Download the SPCC data** from Siril's settings the first time. Without it, color calibration falls back to a generic sensor profile.
- **Soft or blurry result?** Check how high your target was. Objects low on the horizon look softer because you're shooting through more atmosphere.
- **Quick tracking check:** play your subs back in order like a flipbook. If the image wanders, your tracking or polar alignment was off.
- **Harmless warnings:** Siril sometimes shows a "no suitable data" message on denoise, and Mac users may see Python crash warnings. Both are safe to ignore.

---

## Part 1b: Stacking Unistellar smart-telescope data

Unistellar telescopes (eVscope, Odyssey, etc.) stack automatically in the app. If you stack the **individual raw frames** yourself in Siril, you can usually get noticeably better color, less noise and more detail.

### The raw files
Unistellar raw frames are **FITS** files (`.fits` / `.fit`), one per sub. A single target is usually hundreds to thousands of small files. Put each target's frames in its own folder before you start.

### Unistellar-specific steps in Siril
1. **Check the color (Bayer) pattern before anything else.** The pattern in Unistellar file headers can be wrong. Odyssey frames, for example, are labeled **RGGB** but are really **GBRG**. If your first test stack looks strangely tinted (green/magenta or swapped colors), go to Siril's debayer settings, tick the option to **ignore the header pattern**, and try **GBRG**.
2. **Debayer and register** with rotation allowed. Unistellar uses an up/down–left/right mount, so the field rotates during the session. Siril's normal star-alignment handles this.
3. **Stack with rejection.** Unistellar sessions often have hundreds of subs, so rejection does a great job of removing satellite trails.
4. **Crop generously.** Field rotation leaves wedge-shaped edges that need cutting off.
5. **Continue with steps 5–11 above:** plate solve, color calibration, background removal, stretch, star removal.

### Unistellar tips
- **Throw out bad frames.** Frames hit by clouds, wind gusts or a bump will be blurry or faint. Siril can sort frames by quality after registration, so drop the worst ones.
- **Don't trust the pointing info in the headers too much.** If plate solving fails, solve using the target's name or coordinates instead of the position stored in the file.
- **Long sessions are worth it.** Unistellar subs are short, so a few thousand of them gives a much cleaner result than a few hundred.
- **The telescope repoints now and then during long sessions.** The framing may shift in jumps rather than drifting smoothly. Registration fixes this, but you'll lose a bit more at the edges.

---

## Part 2: Finding meteors in a night of photos

If you leave a camera shooting all night during a meteor shower, you can end up with thousands of frames. A script can find the few with a meteor and throw out planes, satellites, clouds and trees. Ask Claude to build one using the approach below.

### How a meteor finder works
1. **Sort the frames by capture time** using ExifTool, and remove duplicate or empty files (memory cards sometimes have them).
2. **Use the preview JPEG built into each raw file.** It's much faster than decoding the full raw, and plenty for detection.
3. **Compare each frame with the ones next to it** to find new streaks of light.
4. **Ignore the foreground** (trees, buildings, horizon) using a mask.
5. **Check how thin each streak is.** Meteors are razor thin (1–2 pixels); cloud edges are much fatter. This is often the single most useful test.
6. **Weed out planes and satellites:**
   - **Planes** have blinking lights, so their trail looks dashed and often has red or green in it.
   - **Satellites** show up in several frames in a row along the same straight line.
   - **Meteors** are a single smooth streak in a single frame, often getting brighter or changing color along the way.
7. **Skip twilight frames** at dusk and dawn.
8. **Make contact sheets** (grids of thumbnails) and a spreadsheet of candidates, so you can check them by eye quickly.
9. **Make circled copies** of the meteor frames, so the streak is easy to spot when you share them.

### Tips and common problems
- **Some newer raw formats** (like Nikon's "High Efficiency" NEF) can't be opened by much free software. The built-in preview JPEG works fine for detection.
- **Converting to DNG isn't always a win.** For compressed raw formats, DNGs can come out *larger* and lose camera-specific settings. Keep your originals.
- **No automatic filter is perfect.** Strict plane filters will also throw out some real meteors. Also ask for an **"all streaks" folder** and give it a quick look yourself.
- **Damaged files happen.** Make sure the script skips unreadable frames instead of crashing.
- **Test it.** Ask the script to add fake meteors to some frames and check how many it finds. That tells you whether your settings are too strict or too loose.
- **Green sky?** That's probably **airglow**, a natural glow in the upper atmosphere. It isn't your lens, and it's not aurora unless the space-weather **Kp index** is high.

---

## Part 3: Timelapses & star trails

From the same night of frames you can make:
- a **timelapse** of the whole night (4K at 24 fps looks great)
- **star-trail videos** where trails build up over time, or a "comet-tail" version where they fade behind each star
- a single **star-trail photo** combining the whole night
- a **"stars-only" trail** where planes and satellites fade out instead of cluttering the image
- a **meteor composite**: all the night's meteors placed into one photo

### Making videos that actually play smoothly
High-res night-sky timelapses often **stutter or freeze**. There are two usual causes:

1. **The file is too heavy.** Sensor grain makes video files huge, often hundreds of Mbps, which phones and laptops can't keep up with. A light noise reduction and slightly more compression bring it down to tens of Mbps with no visible difference.
2. **The wrong video format for the resolution.** At 4K-and-above resolutions, the common H.264 format often won't play on Macs, iPhones or iPads. Use **HEVC (H.265)** instead.

Here's a good starting FFmpeg command. You can also just ask Claude to "make a 4K HEVC timelapse from this folder":

```bash
ffmpeg -framerate 24 -i frames/%05d.jpg \
  -vf "hqdn3d=3:3:0:0" \
  -c:v libx265 -crf 20 -preset slow -tag:v hvc1 -pix_fmt yuv420p \
  timelapse_4k.mp4
```

- `hqdn3d=3:3:0:0` is a light noise reduction that works **within** each frame only. Avoid noise reduction that blends frames together, because it erases meteors (they only appear in one frame).
- `-crf 20` sets the quality. Lower numbers mean higher quality and bigger files; 18–23 is a good range.
- `-tag:v hvc1` makes the video play on Apple devices.
- **Windows:** to play HEVC in the built-in Photos/Movies apps, install **HEVC Video Extensions** from the Microsoft Store, or just use **VLC** (free).

**Tips:**
- **Make one version with your edit** (contrast, gamma) and **one natural version**, then pick the better one.
- **A star-trail video doubles as a tracking check.** On a tracked shot, the stars shouldn't trail.
- **Save disk space** by converting raws in batches instead of all at once.

---

## Tips for working with an AI assistant on this

- **Write down what you want first.** A short notes file ("find meteors, ignore planes, give me contact sheets") keeps things on track across sessions.
- **Ask for things you can look at:** contact sheets, before/after pairs, a spreadsheet of results. That's much faster than opening files one by one.
- **Push back when something looks off.** "You're missing meteors," "this looks hazy" and "the video stutters" are exactly the feedback that gets you to a good result.
- **Ask it to explain.** If a step or setting doesn't make sense, ask "why?" It's a good way to learn the processing as you go.
- **Want to look at results on your phone?** Ask for a simple web page with before/after toggles.
