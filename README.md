# 🎯 Messenger Focus Extension

A Chrome extension that strips away the distractions and transforms Facebook and Instagram into clean, messaging-only experiences.

<img width="465" height="299" alt="image" src="https://github.com/user-attachments/assets/a9774e55-6519-48e8-9323-6d639d489354" />


## 💭 The Story Behind This Project

I got really frustrated with Meta's Facebook and Instagram constantly fighting for my attention and making it way too easy to fall into doomscroll black holes. But here's the thing—I can't just delete my accounts because I actually need to stay connected with people through messaging.

So I thought: *what if I could strip away all the noise and keep just the core messaging experience?*

That's where this extension comes in. It lets you transform Facebook and Instagram into distraction-free messaging platforms. Plus, Meta announced they're killing the desktop app and messenger.com in April 2026, so I decided to build this as a fun personal challenge—a way to take control back and stay focused instead of getting sucked into the endless feed.

## ✨ Features

- **🔄 Smart Redirect to Messenger** - Automatically reroutes you directly to Messenger when you visit Facebook or Instagram, skipping all the distractions
- **🗑️ Remove Navigation Buttons** - Strips away the sidebar and top navigation to eliminate temptation to browse feeds
- **💬 Messaging-Only Experience** - See only your conversations and messages, nothing else
- **⚙️ Easy Toggle** - Simple on/off control in the popup to enable/disable the extension
- **🔒 Privacy-Focused** - All settings stored locally in your browser

### Visual Comparison

**Facebook:**

| Before | After |
|--------|-------|
| <img width="600" alt="Facebook Before" src="https://github.com/user-attachments/assets/ce82de22-6651-4a20-94c9-6a0b5b181cf3" /> | <img width="600" alt="Facebook After" src="https://github.com/user-attachments/assets/0fe11c94-4c5e-48e4-95b5-bf5733ce0d08" /> |

**Instagram:**

| Before | After |
|--------|-------|
| <img width="600" alt="Instagram Before" src="https://github.com/user-attachments/assets/1b108fea-aded-4011-9a7a-4ef567a9cba2" /> | <img width="600" alt="Instagram After" src="https://github.com/user-attachments/assets/f1c289f0-c292-4c95-942c-9809cef320b5" /> |

## 🎯 What It Does

### Smart Redirect
- **Auto-redirect to Messenger** - When you visit facebook.com or instagram.com, the extension can automatically send you straight to messenger
- Bypass the main site entirely and go straight to your conversations

### Navigation Removal
Both Facebook and Instagram have navigation elements that tempt you to explore feeds and other features. This extension removes them completely:

#### For Facebook
- **Removes the left sidebar** (where Feeds, Videos, Marketplace, etc. live)
- **Removes the top navigation bar buttons** that link to news feeds and other distractions
- **Hides the right sidebar** (friend suggestions, ads, trending topics)
- **Focuses exclusively on the Messages interface**

#### For Instagram  
- **Removes the sidebar navigation** (Home, Explore, Reels, etc.)
- **Hides all navigation buttons** that could lead you to the feed
- **Eliminates the explore button and stories**
- **Keeps only the Direct Messages section visible**

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
2. **Enable "Redirect to Messenger"** - This is the primary feature that takes you straight to messages
3. Optionally toggle **"Remove Navigation"** to hide nav buttons and sidebars from the pages
4. Visit Facebook or Instagram—you'll be taken directly to Messenger or see a messages-only interface!

**Pro Tip:** Enable both toggles for the ultimate distraction-free experience

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
