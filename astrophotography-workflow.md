# Astrophotography with Claude Code: Stacking, Star Removal & Meteor Detection

Notes from a series of Claude Code sessions (Aug–Oct 2026) run on a MacBook Pro. Every step also runs on Windows; see Prerequisites. Covers:

1. Stacking and finishing Unistellar Odyssey data in **Siril** + **StarNet2**
2. Finding meteors (vs. planes/satellites) in **Nikon Z8** night-sky sequences
3. Making 4K timelapses and star-trail videos from the same frames

---

## Prerequisites

| Tool | Used for | macOS | Windows |
|---|---|---|---|
| **Claude Code** | Driving the whole workflow | `npm install -g @anthropic-ai/claude-code` (or the Claude desktop app) | Same `npm` command, or the Claude desktop app |
| **Siril** (1.2+) | Stacking, plate solving, SPCC color calibration, background extraction, denoise, stretch | `brew install --cask siril` or DMG from [siril.org](https://siril.org/download/) | Installer from [siril.org](https://siril.org/download/) |
| **StarNet2** | Star removal (starless + star-layer images) | Download the macOS build from [starnetastro.com](https://www.starnetastro.com/) and unzip, e.g. to `~/StarNet2/`. Clear quarantine: `xattr -dr com.apple.quarantine ~/StarNet2` | Download the Windows build from [starnetastro.com](https://www.starnetastro.com/) and unzip, e.g. to `C:\StarNet2\` |
| **Python 3.12** | Meteor detection pipeline, custom image steps | `brew install python@3.12` (macOS's built-in Python is too old) | `winget install Python.Python.3.12` or [python.org](https://www.python.org/downloads/) |
| Python packages | Image decoding & analysis | `python3.12 -m venv .venv && source .venv/bin/activate && pip install numpy pandas scipy opencv-python rawpy pillow tifffile` | `py -3.12 -m venv .venv` → `.venv\Scripts\activate` → same `pip install …` |
| **ExifTool** | Reading capture timestamps, building a frame manifest | `brew install exiftool` | `winget install OliverBetz.ExifTool` or [exiftool.org](https://exiftool.org/) |
| **FFmpeg** | Timelapse & star-trail video encoding | `brew install ffmpeg` | `winget install Gyan.FFmpeg` or [ffmpeg.org](https://ffmpeg.org/download.html) |
| **Adobe DNG Converter** *(optional)* | Converting Nikon HE NEF raws for tools that can't read them | [Adobe download page](https://helpx.adobe.com/camera-raw/using/adobe-dng-converter.html) | Same |

**Register StarNet2 in Siril:** *Preferences → Miscellaneous → StarNet executable* → point to the `starnet2` binary (`starnet2.exe` on Windows). After that, Siril's `starnet` command and the *Image Processing → Star Processing → StarNet* menu both work.

**Disk space:** a single night of Z8 raws can be 50–100 GB. Keep at least 2× the size of the night's raws free while processing.

---

## 1. Stacking Unistellar data in Siril + StarNet2

**Targets:** Eastern Veil (NGC 6992, 733 subs) and Crescent Nebula (NGC 6888, 4,605 subs). The goal was better color and detail than the Odyssey's own in-app result.

### Pipeline
1. **Stack** the raw light frames in Siril.
2. **Plate solve**, then run **SPCC** (Spectrophotometric Color Calibration) against Gaia DR3.
3. **Background extraction** to remove gradients.
4. **Denoise** at half strength (`denoise -mod=0.5`).
5. **Linked autostretch** (`autostretch -linked`).
6. **Saturation** boost.
7. **StarNet2** to split the image into starless and star layers.
8. **Recombine** with stars reduced (e.g. 30% star layer) for a nebula-forward final.

Outputs per target: final, stars-30%, starless, and star layer, as PNG and 16-bit TIFF. Keep `result_spcc.fit` as the linear master.

### Gotchas
- **Wrong Bayer pattern in the headers.** The Unistellar light-frame headers say `RGGB`, but the real pattern is **`GBRG`** (probably because two rows are cropped). Override it in Siril or the colors come out wrong.
- **Always use a linked stretch.** An unlinked autostretch wrecks the color balance that SPCC just fixed.
- **"Smoky haze" in starless images** came from full-strength denoise plus saturation. Half-strength denoise plus a second background extraction *on the starless image* fixed it and kept more filament detail.
- Siril's `denoise` / `rmgreen` can print a spurious "no suitable data" error that you can safely ignore.
- Siril and StarNet disagree on FITS row order (the image comes back flipped). Also, PIL can't read 16-bit RGB TIFFs; use `tifffile`.
- If SPCC's sensor database isn't downloaded, it falls back to a generic sensor response. Download it for best color.
- **GHS (Generalized Hyperbolic Stretch)** in Siril is a good alternative to autostretch when you want more control over the highlights.
- **Drift timelapses** (playing the subs in order) are a quick way to check tracking. In one case they showed that the pointing recorded in the frame headers was wrong.
- **macOS only:** Siril's bundled Python can show crash warnings because macOS kills it. They're harmless.
- A soft-looking target (e.g. M33) is often caused by low altitude or seeing rather than processing. Check the target's altitude during the capture window.

---

## 2. Meteor vs. plane/satellite detection (Nikon Z8)

**Goal:** From thousands of frames per night, pull out the few that contain a meteor, and reject planes, satellites, clouds, and trees.

### Pipeline (Python)
1. **Manifest + dedupe** with ExifTool. Cards had zero-byte and duplicate files, and a night can roll over into a second folder mid-session, so merge folders by timestamp.
2. **Decode the embedded full-res JPEG** from each NEF (~66 ms/frame; a whole night in ~11 s on 16 cores).
3. **Frame differencing + streak detection** with OpenCV.
4. **Static mask** for the treeline and foreground.
5. **Shape cuts:** streak **width** is the key separator (meteors have a median width of ~1.6 px; cloud edges are ~24 px). Elongation alone isn't enough.
6. **Aircraft rejection:** an **autocorrelation "dash" test** catches blinking nav lights. Strobe/color and multi-frame track-linking tests catch planes and satellites that span several frames.
7. **Twilight gate** to ignore frames at dusk and dawn.
8. **Recall harness:** inject synthetic meteors to measure recall and the false-positive rate while tuning.
9. Output ranked candidate JPEGs, **contact sheets**, and an `index.csv` / `detections.csv` with coordinates for manual review.

Results ranged from ~70 to ~120 candidates per night for review. After plane/satellite filtering, the "confident meteor" bucket shrank dramatically (389 → 7 on one night). Because of that, it's worth also exporting a "**all streaked frames**" folder for a human pass.

### Gotchas
- **Nikon Z8 "High Efficiency" NEFs can't be decoded by LibRaw/rawpy.** Use the embedded JPEG for detection, and Adobe DNG Converter if you need full raw data.
- **DNG isn't a free win:** converted DNGs were **1.42× larger** than HE NEFs and lost Picture Control metadata. Keep the NEFs.
- **Morphological closing made false positives much worse.** Skip it.
- An FFT-based dash test never triggered; autocorrelation worked.
- Some card files were truncated or corrupt, so make every step skip unreadable frames instead of crashing.
- A green cast across the sky was **airglow**, not a lens problem. Checking NOAA's Kp index (quiet, ~1–2) ruled out aurora.

### October refinements
Later sessions (October) improved the pipeline:
- **Fixed a dash-test bug.** Smooth meteors were scoring higher than dashed plane trails, the reverse of what's intended.
- **Added a refinement pass (`refine.py`)** that labels each streak as one of:
  - persistent sky features
  - **satellites** (the line continues across consecutive frames)
  - **aircraft** (red nav-light color)
- Added **A/B contact sheets** and denoised thumbnails for faster human review.
- Added **circled copies** of each meteor frame, so the streak is easy to spot when sharing.
- Added **stack scripts**:
  - a meteor composite (all meteors from the night on one image)
  - a **"stars-only" star-trail timelapse** where planes and satellites fade out like clouds instead of piling up into the trails

---

## 3. Timelapses & star trails

- **4K (3840×2560) at 24 fps** from the full night's frames, in graded (gamma 1.8) and ungraded versions.
- **Accumulating star-trail** and **"comet-tail"** trail videos, plus a single full-resolution star-trail composite.
- To keep disk use low (peak ~5.5 GB), convert the raws in batches rather than all at once.

### Encoding tips (FFmpeg)
Choppy or frozen playback had two causes, neither of them dropped frames:
1. **Bitrate.** At `-crf 16` the sensor grain produced 178–403 Mbps files that players couldn't keep up with. **Spatial-only denoise** plus `-crf 20` brought them down to 10–61 Mbps with no visible loss. *Don't* use temporal denoise, because it erases single-frame meteors.
2. **H.264 level.** 3840×2560 H.264 requires level 6.0, which Apple's hardware decoder rejects, so the video freezes on Macs and iPhones. **Encode as HEVC instead:**

```bash
ffmpeg -framerate 24 -i frames/%05d.jpg \
  -vf "hqdn3d=3:3:0:0" \
  -c:v libx265 -crf 20 -preset slow -tag:v hvc1 -pix_fmt yuv420p \
  timelapse_4k.mp4
```

- `hqdn3d=3:3:0:0` applies spatial denoise only (the temporal values are set to 0).
- `-tag:v hvc1` is needed for QuickTime and iOS to play the file.
- **macOS:** check that hardware decode works with `ffmpeg -hwaccel videotoolbox -i timelapse_4k.mp4 -f null -`.
- **Windows:** HEVC playback in the built-in apps needs Microsoft's *HEVC Video Extensions* from the Microsoft Store. VLC plays it with no add-ons.
- Accumulated trails are a quick way to check tracking: on a "tracked" night they showed the stars were still trailing.

---

## Lessons for working with Claude Code on this

- Give Claude a written spec (e.g. a `PIPELINE.md`) for multi-step processing. It follows it and keeps notes.
- Ask for **contact sheets** and CSVs, which are much faster to review than individual frames.
- Push back when results look wrong ("you're missing meteors," "this looks hazy"). Each correction above came from that.
- For viewing results on a phone, Claude can publish a private web page with before/after toggles (iOS Safari blocks `data:` downloads, so use the Web Share API for saving).
