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

### Easy Setup for Everyone

#### Step 1: Build the Extension (One-time)
```bash
bash build.sh
```
Wait for **"Build complete!"** message ✅

#### Step 2: Load Into Chrome
1. Open Chrome and go to: `chrome://extensions/`
2. Turn on **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked** (green button)
4. Select the **Messenger-Focus-Extension** folder
5. The extension appears in your list ✅

## 🚀 Usage & Testing

### Quick Start
1. Click the extension icon in your Chrome toolbar
2. You'll see **5 controls**:
   - **All Features** toggle at the top to turn all features on/off at once
   - **4 individual toggles** for each feature
3. Toggle features **ON** (blue) to enable them
4. Refresh the page to see changes

### Troubleshooting
| Issue | Fix |
|-------|-----|
| Extension won't load | Make sure Developer mode is turned ON (blue toggle) |
| Features don't work | Check that the feature toggle is ON (blue), refresh page |
| Extension disappeared | Check `chrome://extensions/` - it may be disabled |
| Need to rebuild | Run `bash build.sh` again and reload extension |

**Pro Tip:** Enable all toggles for the ultimate distraction-free experience

## 🛠️ Development

Built with:
- **TypeScript** - For type-safe Chrome extension code
- **ESLint & Prettier** - For code quality and formatting
- **Chrome Extensions API** - For browser integration

### Project Structure
```
src/
├── redirect/       # Service worker for redirect logic
├── removal/        # Content scripts that remove UI elements
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

This project is open source and available under the MIT License.

## 🌐 Browser Support

| Browser | How to Install |
|---------|---|
| **Chrome** | Extract ZIP → `chrome://extensions/` → **Load unpacked** |
| **Brave** | Extract ZIP → `brave://extensions/` → **Load unpacked** |
| **Edge** | Extract ZIP → `edge://extensions/` → **Load unpacked** |
| **Opera** | Extract ZIP → `opera://extensions/` → **Load unpacked** |
| **Firefox** | Extract ZIP → `about:debugging` → **Load Temporary Add-on** |

---

## 👨‍💻 Built By

Developed by **Christian Valencia** 

**ValAid**: *A ValAid solution might be your valid solution*

---
