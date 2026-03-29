# 🎯 Messenger Focus Extension

A Chrome extension that strips away the distractions and transforms Facebook and Instagram into clean, messaging-only experiences.

<img width="465" height="299" alt="image" src="https://github.com/user-attachments/assets/a9774e55-6519-48e8-9323-6d639d489354" />


## 💭 The Story Behind This Project

I got really frustrated with Meta's Facebook and Instagram constantly fighting for my attention and making it way too easy to fall into doomscroll black holes. But here's the thing—I can't just delete my accounts because I actually need to stay connected with people through messaging.

So I thought: *what if I could strip away all the noise and keep just the core messaging experience?*

That's where this extension comes in. It lets you transform Facebook and Instagram into distraction-free messaging platforms. Plus, Meta announced they're killing the desktop app and messenger.com in April 2026, so I decided to build this as a fun personal challenge—a way to take control back and stay focused instead of getting sucked into the endless feed.

## ✨ Features

- **Messaging-Only Mode**: Strip Facebook and Instagram down to their essentials—just your conversations
- **Smart Redirects**: Option to redirect directly to messenger when needed
- **Distraction Removal**: Toggle to hide feeds, notifications, and other attention-grabbing elements
- **Easy Toggle**: Simple popup control to enable/disable the extension on the fly
- **Works Offline**: Settings are stored locally in your browser

### Visual Comparison

| Before | After |
|--------|-------|
|<img width="1895" height="1017" alt="Screenshot 2026-03-29 202744" src="https://github.com/user-attachments/assets/ce82de22-6651-4a20-94c9-6a0b5b181cf3" /> |<img width="1894" height="1016" alt="Screenshot 2026-03-29 202811" src="https://github.com/user-attachments/assets/0fe11c94-4c5e-48e4-95b5-bf5733ce0d08" /> |(<img width="1896" height="1011" alt="Screenshot 2026-03-29 202644" src="https://github.com/user-attachments/assets/1b108fea-aded-4011-9a7a-4ef567a9cba2" /> |<img width="1895" height="1011" alt="Screenshot 2026-03-29 202636" src="https://github.com/user-attachments/assets/f1c289f0-c292-4c95-942c-9809cef320b5" /> |

## 🎯 What It Does

### For Facebook
- Removes the main feed and recommended content
- Hides the right sidebar distractions
- Focuses on the messaging interface

### For Instagram  
- Strips the explore page and recommendations
- Cleans up story sections and notifications
- Keeps your DMs front and center

## 📦 Installation

### For Developers (Building from Source)
1. Clone or download this repository
2. Build the extension:
   ```bash
   bash build.sh
   ```
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer Mode** (toggle in the top right)
5. Click **Load unpacked** and select the `dist/` folder from this project
6. The extension icon should appear in your toolbar

### For Non-Developers (Using Shared ZIP)
1. Download `Messenger-Focus-Extension.zip`
2. Extract the ZIP file
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer Mode** (toggle in the top right)
5. Click **Load unpacked**
6. Select the extracted `dist/` folder
7. Done! The extension is now active

## 🚀 Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle the features on/off based on your preferences:
   - **Redirect to Messenger** - Takes you straight to messages
   - **Remove Distractions** - Hides feeds and extra noise
3. Visit Facebook or Instagram—enjoy the cleaner experience!

![Extension Popup](./images/popup-screenshot.png)
*Screenshot of the extension popup showing toggle options*

## 🛠️ Development

Built with:
- **TypeScript** - For type-safe Chrome extension code
- **ESLint & Prettier** - For code quality and formatting
- **Chrome Extensions API** - For browser integration

### Project Structure
```
src/
├── background/     # Service worker for background tasks
├── content/        # Content scripts that modify pages
├── popup/          # Extension popup UI and logic
└── style/          # CSS for modifications
```

### Building & Linting
```bash
bash build.sh        # Compile and build the extension
npm run lint         # Check code quality
npm run format       # Format with Prettier
```

## ⚠️ Disclaimer

This is a personal project and not affiliated with Meta/Facebook/Instagram. Use responsibly and be aware that website updates from Meta may affect the extension's functionality.

## 📝 License

ISC

---

## 🤝 Sharing This Extension

Want to share this with friends? Here are the easiest ways:

### Option 1: **ZIP Package Distribution** (Simplest)
Generate a single ZIP file to share with anyone:
```bash
bash export-crx.sh
```

This creates `Messenger-Focus-Extension.zip` in your project root. Your friends can:
1. Extract the ZIP
2. Follow the "For Non-Developers" installation steps above
3. Done! No coding experience needed

### Option 2: **GitHub Releases** (Recommended for Version Control)
1. Go to your GitHub repository
2. Create a [Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-and-tags)
3. Upload the `Messenger-Focus-Extension.zip` file (from running `bash export-crx.sh`)
4. Share the release link with friends
5. They can download and install (see non-developer instructions above)

### Option 3: **Chrome Web Store** (Most Professional)
For wider distribution, publish to the Chrome Web Store:
1. Create a [Chrome Developer Account](https://chromewebstore.google.com/publish)
2. Upload your extension (pay the one-time $5 fee)
3. Wait for review (usually a few hours to a day)
4. Share the Web Store link—users can one-click install with no setup needed

---

## 🌐 Browser Support

| Browser | How to Install |
|---------|---|
| **Chrome** | Extract ZIP → `chrome://extensions/` → **Load unpacked** |
| **Brave** | Extract ZIP → `brave://extensions/` → **Load unpacked** |
| **Edge** | Extract ZIP → `edge://extensions/` → **Load unpacked** |
| **Opera** | Extract ZIP → `opera://extensions/` → **Load unpacked** |
| **Firefox** | Extract ZIP → `about:debugging` → **Load Temporary Add-on** |

### Full Installation Guide
See "For Non-Developers (Using Shared ZIP)" under [Installation](#-installation) section above.

---

## 📸 Images Directory

To use the image placeholders above, create an `images/` folder in your project root and add:
- `banner.png` - Hero/banner image
- `facebook-before.png` - Facebook before using the extension
- `facebook-after.png` - Facebook after using the extension
- `popup-screenshot.png` - Screenshot of the extension popup
