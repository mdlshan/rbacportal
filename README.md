First things first, create an admin account.

# Admin Setup
I left an admin user in the database. Idk if it works or not, but anyway, try these credentials first:

* **Username:** `admin`
* **Password:** `password@123` (Django says passwords must be at least 8 characters, but password seeding works.)

If that doesn't work, create a superuser using:

```bash
python manage.py createsuperuser
```

Then go to Django Admin panal, create a group named `Admin`, and add your user to that group.
**Group = Role.**

**NOW YOU'RE AN ADMIN. CONGRATULATIONS!**

Now get back to the frontend and log in using your admin credentials.

### What Now?

1. Open **Users** through the sidebar.
2. As an Admin, you can manage users, roles, and permissions.
3. Admin currently has access to everything.

---

* **Users Button:** If a logged-in user doesn't have the `Admin` role, they shouldn't see the Users button in the sidebar.
* **Dashboard:** Visible to every authenticated user.
* **Personal Information:** Every user can view and manage their own additional information without needing Admin access.


