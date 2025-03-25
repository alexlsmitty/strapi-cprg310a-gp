# Housekeepin App 🏠📝💰

Welcome to **Housekeepin App** – your one-stop solution for managing household tasks, events, and budgets all in one place! 🎉 This application is designed to simplify household management, whether you're tracking chores, scheduling events, or keeping an eye on your budget. Invite family members, share responsibilities, and stay organized with ease. ✨

## Features 🚀

- **Calendar View** 📅  
  Smooth, animated month transitions with a responsive grid that ensures all day cells maintain a consistent aspect ratio.

- **Task Management** ✅  
  Create, edit, and track your household tasks to ensure nothing falls through the cracks.

- **Budget Tracking** 💸  
  Set a household budget, record transactions, and monitor your spending in real time.

- **User Authentication** 🔒  
  Securely sign up or log in using email or Google OAuth.

- **Theme Switching** 🎨  
  Easily toggle between Light, Dark, and Blue themes to suit your style and mood.

- **Household Collaboration** 👨‍👩‍👧‍👦  
  Invite and manage household members seamlessly to share responsibilities and stay connected.

## Installation 🛠️

Follow these steps to get the app up and running on your local machine:

1. **Clone the Repository**  
   Open your terminal and run:
   ```bash
   git clone https://github.com/alexlsmitty/strapi-cprg310a-gp
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd housekeepin-app
   ```

3. **Install Dependencies**  
   Install the required packages by running:
   ```bash
   npm install
   ```

4. **Create *.env.local* File**
   Create a file in the housekeepin-app directory called *.env.local,* with the following two lines (this connects to Supabase):
   ```bash
   VITE_SUPABASE_URL=https://kfyevvjbynehaegsedbm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeWV2dmpieW5laGFlZ3NlZGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTkyMTEsImV4cCI6MjA1NjU3NTIxMX0.25YVqsQXeecJAPx8A-Vlnt3PyxnQYS13GlglDfv-Rh4
   ```
        
5. **Run the Application**  
   Start the development server with:
   ```bash
   npm run dev
   ```
   Your app should now be running at [http://localhost:3000](http://localhost:3000) (or the port specified by Vite)! 🚀

## Technology Stack 💻

- **React** – For building a dynamic and interactive user interface.
- **Vite** – A fast build tool and development server.
- **Material-UI** – To provide a sleek, modern design with responsive components.
- **Supabase** – Backend services for authentication and real-time database operations.
- **date-fns** – For efficient date handling and formatting.

## Usage 📱

After installing, open your browser and navigate to the app. From there, you can:
- **Sign Up / Log In** using email or Google.
- **Manage Tasks**: Add, update, and mark tasks as complete.
- **View Calendar**: Check out your scheduled events and tasks in a monthly view with smooth animations.
- **Track Budget**: Set up your household budget, add transactions, and see your remaining balance.
- **Invite Members**: Create your household and invite others to join and collaborate.

Customize your experience with our theme switcher and enjoy a clutter-free, organized household management tool! 🌟

## Contributing 🤝

Contributions are very welcome! If you have ideas for improvements, bug fixes, or new features, please feel free to:
- Open an issue on GitHub.
- Fork the repository and submit a pull request.

Let's build a better Housekeepin App together! 🛠️💪

## License 📄

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy organizing your household with Housekeepin App! 🏡✨  
Happy managing! 🎉

