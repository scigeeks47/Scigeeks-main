# SciGeeks Local Setup Guide 🚀

Welcome to SciGeeks! Follow this friendly, step-by-step guide to get the application running on your computer. 

This guide is designed to be **extremely simple**—even a 10-year-old can follow it. No prior coding experience is needed!

---

## 1. What is SciGeeks?
SciGeeks is an interactive educational web app designed to help you study and learn science. It features a smart AI assistant that retrieves facts directly from NCERT Biology textbooks to answer your questions accurately. The app also lets you create a personal account, track your progress, and learn using custom study tools.

---

## 2. Before You Start
We need to install a few free tools on your computer. Click the links below, download the installers, and run them with the default options:

1. **VS Code (Visual Studio Code)**
   * **What is it?** A simple text editor where we will view our code and open terminals.
   * **Download link:** [Download VS Code](https://code.visualstudio.com/)
2. **Node.js (Version 20 LTS recommended)**
   * **What is it?** It runs the website code and the main server on your computer.
   * **Download link:** [Download Node.js](https://nodejs.org/en) (Choose the version labeled **LTS**).
3. **Python (Version 3.12)**
   * **What is it?** It runs our smart AI backend assistant.
   * **Download link:** [Download Python 3.12](https://www.python.org/downloads/release/python-3120/)
   * > [!IMPORTANT]
     > During the installation, make sure to check the box that says **"Add Python to PATH"** or **"Add python.exe to PATH"**.
4. **Git (Optional)**
   * **What is it?** A tool used to download code from GitHub.
   * **Download link:** [Download Git](https://git-scm.com/)

---

## 3. Folder Structure
If you open the `Scigeeks-App` folder on your computer, you will see three main folders inside it:

* 📁 **`scigeeks`** → The frontend website interface. This is what you see and click on in your web browser (buttons, text boxes, dashboard).
* 📁 **`backend`** → The Express backend server. It handles saving users, auth logic, and communicates with the database.
* 📁 **`python_ai`** → The Python AI service. This contains the smart AI model logic and searches through NCERT textbooks (FAISS index).

---

## 4. Create Environment Files
Environment files (called `.env` files) store secret keys so that your app can talk securely to external services like Supabase (our database and login system) and OpenAI.

We need to create **three separate** `.env` files. Let's do this step-by-step:

### File 1: Python AI Server Configuration
1. Open VS Code.
2. Open the `python_ai` folder.
3. Create a new file named exactly `.env`.
4. Copy and paste the following content:

```env
# Path: python_ai/.env
OPENAI_API_KEY=your_openai_api_key_here
PORT=8000
```
> **Where do these values come from?**
> * `OPENAI_API_KEY`: Create an account on [OpenAI Platform](https://platform.openai.com) and generate an API key.

---

### File 2: Express Backend Server Configuration
1. In VS Code, open the `backend` folder.
2. Create a new file named exactly `.env`.
3. Copy and paste the following content:

```env
# Path: backend/.env
PORT=5000
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PYTHON_AI_URL=http://localhost:8000
```
> **Where do these values come from?**
> * Go to your [Supabase Dashboard](https://supabase.com/).
> * Click on your project -> **Project Settings** (gear icon) -> **API**.
> * Copy the **Project URL** (paste into `SUPABASE_URL`) and the **`anon` `public`** key (paste into `SUPABASE_ANON_KEY`).

---

### File 3: Frontend Website Configuration
1. In VS Code, open the `scigeeks` folder.
2. Create a new file named exactly `.env.local`.
3. Copy and paste the following content:

```env
# Path: scigeeks/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
> [!NOTE]
> Make sure to use the exact same `SUPABASE_URL` and `SUPABASE_ANON_KEY` values that you used in the backend `.env` file.

---

## 5. Start the Python AI Server
Now we will turn on the AI assistant server.

1. In VS Code, open a terminal window by clicking **Terminal** -> **New Terminal** at the top menu.
2. Move into the AI folder by typing this command and hitting **Enter**:
   ```powershell
   cd python_ai
   ```
3. Create a virtual environment (a private container for Python tools) by typing:
   ```powershell
   python -m venv venv
   ```
4. Activate the virtual environment:
   * **On Windows:**
     ```powershell
     .\venv\Scripts\activate
     ```
   * **On macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
   *(You should see `(venv)` appear at the beginning of your terminal line).*
5. Install the required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```
6. Start the AI server:
   ```powershell
   uvicorn main:app --reload --port 8000
   ```
7. You should see text ending with:
   `INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)`
   * **What does this mean?** It means the AI server is running successfully and is listening for questions on port `8000`. Keep this terminal window open!

---

## 6. Start the Express Backend
Next, we will turn on our main database backend server.

1. **Open a new terminal window** (click the **`+`** icon on the top-right of your current terminal panel in VS Code, or go to **Terminal** -> **New Terminal**).
2. Move into the backend folder:
   ```powershell
   cd backend
   ```
3. Install the required packages:
   ```powershell
   npm install
   ```
4. Start the backend server:
   ```powershell
   npm run dev
   ```
5. You should see a message saying:
   `Server running on port 5000`
   * **What does this mean?** It means the main backend database coordinator is successfully running on port `5000` and waiting for the website frontend to talk to it. Keep this terminal open!

---

## 7. Start the Frontend
Finally, we will start the visible website interface.

1. **Open a third terminal window** (click the **`+`** icon on the top-right of the terminal panel in VS Code again).
2. Move into the frontend folder:
   ```powershell
   cd scigeeks
   ```
3. Install the required packages:
   ```powershell
   npm install
   ```
4. Start the Next.js frontend:
   ```powershell
   npm run dev
   ```
5. You should see messages ending with:
   `- Local: http://localhost:3000`
   `✓ Ready in 1.2s`
   * **What does this mean?** The website is ready! It compiled successfully, and you can now open it in your browser. Keep this terminal open!

---

## 8. Open the Website
1. Open your web browser (Google Chrome, Microsoft Edge, Safari, or Firefox).
2. Type `http://localhost:3000` in the address bar at the top and press **Enter**.
3. You should see the SciGeeks home screen containing a welcome message and a **Login / Sign Up** form.

---

## 9. Test Everything
Follow this simple checklist to make sure your setup is working perfectly:

1. **Create an Account:** Go to the signup form, enter your email, and pick a password. Click **Sign Up**.
2. **Verify Email:** If you configured a standard Supabase setup, check your email inbox (or Supabase local logs) for a confirmation link. Click it to verify.
3. **Login:** Log in with your new email and password.
4. **Open Dashboard:** Confirm that you are redirected to the SciGeeks Dashboard page showing your user details.
5. **Open AI Page:** Find and click on the **AI Assistant** or **Ask AI** tab on the navigation bar.
6. **Ask a Biology Question:** Type `"What is photosynthesis?"` in the chatbox and press **Send**.
7. **Verify the Response:** 
   * If you have a working OpenAI API key with active credits, the AI will reply with a detailed explanation of photosynthesis based on NCERT Biology.
   * **Note on Billing Errors:** If your OpenAI account does not have billing/credits configured, you will receive an error response from the AI page saying something like: `Error: You exceeded your current quota, please check your plan and billing details.` or `AI is temporarily unavailable.` This is normal and means your backend connected successfully, but OpenAI blocked the request due to billing configuration.

---

## 10. Common Problems
Here is how to solve common errors you might encounter:

### 🔴 "Port 5000 already in use" or "Port 8000 already in use"
* **Why it happens:** Another app or a leftover server process is running on that port.
* **How to fix it:**
  * **Quickest way:** Close all VS Code windows, reopen VS Code, and start the servers again.
  * **Command way (Windows):** Open command prompt and run:
    ```powershell
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
    ```
    *(Replace `5000` with `8000` if the AI port is busy).*

### 🔴 "Module not found" or "Cannot find module"
* **Why it happens:** You forgot to install the packages or installed them in the wrong folder.
* **How to fix it:** Make sure you are in the correct folder (run `pwd` or check your terminal path) and run `npm install` (for `scigeeks` and `backend`) or `pip install -r requirements.txt` (for `python_ai`).

### 🔴 "Invalid token" or login errors
* **Why it happens:** Your Supabase keys are entered incorrectly in the `.env` files.
* **How to fix it:** Check your `backend/.env` and `scigeeks/.env.local` files. Make sure there are no typos, extra spaces, or missing characters in the key values.

### 🔴 "Cannot connect to backend" or infinite loading spinners
* **Why it happens:** The Express backend server is not running, or the port in `.env` doesn't match.
* **How to fix it:** Check terminal #2. Make sure it says `Server running on port 5000` and does not show any errors.

### 🔴 "AI temporarily unavailable" or billing quota errors
* **Why it happens:** Your OpenAI API Key is missing, incorrect, or your OpenAI account ran out of free credits.
* **How to fix it:** Update your `python_ai/.env` file with a valid, active API key from OpenAI, and check your credit status on the [OpenAI Usage Dashboard](https://platform.openai.com/usage).

---

## 11. How to Stop the Project
When you are done studying and want to turn off the servers:

1. Click on terminal window #1 (Python AI), press **`Ctrl` + `C`** on your keyboard, and type `Y` if prompted.
2. Click on terminal window #2 (Backend), press **`Ctrl` + `C`**.
3. Click on terminal window #3 (Frontend), press **`Ctrl` + `C`**.
4. You can now close VS Code safely!

---

## 12. One-Minute Quick Start
Once you have completed the initial setup steps, you don't need to install anything again. To run SciGeeks next time, just open VS Code and run these commands in three separate terminals:

* **Terminal 1 (AI Server):**
  ```powershell
  cd python_ai
  .\venv\Scripts\activate
  uvicorn main:app --reload --port 8000
  ```
* **Terminal 2 (Backend):**
  ```powershell
  cd backend
  npm run dev
  ```
* **Terminal 3 (Frontend):**
  ```powershell
  cd scigeeks
  npm run dev
  ```

Open [http://localhost:3000](http://localhost:3000) and start learning! 🚀
